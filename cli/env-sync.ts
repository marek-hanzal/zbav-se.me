import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type EnvMap = Record<string, string>;

interface ParsedEnvFile {
	environment: string;
	variables: EnvMap;
	secrets: EnvMap;
}

interface VercelEnv {
	id: string;
	key: string;
	system?: boolean;
	target?: string[];
}

const REPO = "marek-hanzal/zbav-se.me";
const ENV_DIRECTORY = "@env";

function printUsage(reason?: string, exitCode = 1): never {
	const availableEnvironments = listAvailableEnvironments();

	if (reason) {
		console.error(reason);
		console.error("");
	}

	console.error("Usage: bun run env:sync <environment> <vercel-project-id>");
	console.error("");
	console.error(`Available environments: ${availableEnvironments.join(", ") || "(none found)"}`);
	console.error("");
	console.error("Examples:");

	for (const environment of availableEnvironments) {
		console.error(`  bun run env:sync ${environment} prj_xxx`);
	}

	process.exit(exitCode);
}

function listAvailableEnvironments() {
	const absoluteDirectory = path.resolve(process.cwd(), ENV_DIRECTORY);

	if (!existsSync(absoluteDirectory)) {
		return [];
	}

	return readdirSync(absoluteDirectory)
		.filter((entry) => entry.endsWith(".json"))
		.map((entry) => path.basename(entry, ".json"))
		.sort((left, right) => left.localeCompare(right));
}

function resolveEnvFilePath(input: string) {
	const absolutePath = path.resolve(process.cwd(), ENV_DIRECTORY, `${input}.json`);

	if (!existsSync(absolutePath)) {
		printUsage(`Environment file not found: ${absolutePath}`, 1);
	}

	return absolutePath;
}

function parseEnvFile(filePath: string): ParsedEnvFile {
	const source = readFileSync(filePath, "utf8");
	const parsed = JSON.parse(source) as Partial<Pick<ParsedEnvFile, "variables" | "secrets">>;
	const variables = withEnvMap(parsed.variables);
	const secrets = withEnvMap(parsed.secrets);

	return {
		environment: path.basename(filePath, ".json"),
		variables,
		secrets,
	};
}

function withEnvMap(source: unknown): EnvMap {
	if (!source || typeof source !== "object" || Array.isArray(source)) {
		return {};
	}

	const envMap: EnvMap = {};

	for (const [key, value] of Object.entries(source)) {
		if (typeof value !== "string") {
			throw new Error(`Invalid env value for ${key}. Expected a string.`);
		}

		envMap[key] = value;
	}

	return envMap;
}

function syncGitHub(parsedEnvFile: ParsedEnvFile) {
	const { environment, variables, secrets } = parsedEnvFile;

	console.log(`Syncing GitHub environment "${environment}"...`);

	const existingVars = listGhNames([
		"gh",
		"variable",
		"list",
		"-R",
		REPO,
		"--env",
		environment,
		"--json",
		"name",
		"-q",
		".[].name",
	]);

	const existingSecs = listGhNames([
		"gh",
		"secret",
		"list",
		"-R",
		REPO,
		"--env",
		environment,
		"--json",
		"name",
		"-q",
		".[].name",
	]);

	console.log(`Deleting ${existingVars.length} variables and ${existingSecs.length} secrets...`);

	for (const name of existingVars) {
		console.log(`  Deleting variable ${name}`);
		runGh([
			"gh",
			"variable",
			"delete",
			name,
			"-R",
			REPO,
			"--env",
			environment,
		]);
	}

	for (const name of existingSecs) {
		console.log(`  Deleting secret ${name}`);
		runGh([
			"gh",
			"secret",
			"delete",
			name,
			"-R",
			REPO,
			"--env",
			environment,
		]);
	}

	const varEntries = Object.entries(variables).filter(([, v]) => v);
	const secEntries = Object.entries(secrets).filter(([, v]) => v);

	console.log(`Creating ${varEntries.length} variables and ${secEntries.length} secrets...`);
	for (const [name, value] of varEntries) {
		console.log(`  Setting variable ${name}`);
		runGh([
			"gh",
			"variable",
			"set",
			name,
			"-R",
			REPO,
			"--env",
			environment,
			"--body",
			// biome-ignore lint/style/noNonNullAssertion: Ssst
			value!,
		]);
	}

	for (const [name, value] of secEntries) {
		console.log(`  Setting secret ${name}`);
		runGh([
			"gh",
			"secret",
			"set",
			name,
			"-R",
			REPO,
			"--env",
			environment,
			"--body",
			// biome-ignore lint/style/noNonNullAssertion: Ssst
			value!,
		]);
	}

	console.log(`GitHub environment "${environment}" synced.`);
}

async function syncVercel(parsedEnvFile: ParsedEnvFile, projectId: string) {
	const { environment, variables, secrets } = parsedEnvFile;

	console.log(`Syncing Vercel environment "${environment}"...`);

	const token = secrets.VERCEL_TOKEN;
	const orgId = variables.VERCEL_ORG_ID;

	if (!token || !orgId) {
		throw new Error("Missing VERCEL_TOKEN or VERCEL_ORG_ID.");
	}

	const target = "production";

	const allKeys = Object.keys(variables).concat(Object.keys(secrets));
	const sensitiveKeys = new Set(Object.keys(secrets));

	const existingEnvs = fetchExistingEnvs(projectId, orgId, token);
	const existingToDelete = existingEnvs.filter(
		(env) => env.system !== true && env.target?.includes(target),
	);

	if (existingToDelete.length > 0) {
		console.log(`Deleting ${existingToDelete.length} existing Vercel envs...`);
		deleteExistingEnvs(
			projectId,
			orgId,
			token,
			existingToDelete.map((e) => e.id),
		);
	}

	const payload = allKeys
		.filter((key) => key !== "VERCEL_APP_PROJECT_ID")
		.map((key) => {
			const value = variables[key] ?? secrets[key];
			return {
				key,
				target: [
					target,
				] as const,
				type: sensitiveKeys.has(key) ? ("sensitive" as const) : ("plain" as const),
				value: value ?? "",
			};
		});

	console.log(`Creating ${payload.length} Vercel envs...`);
	createEnvs(projectId, orgId, token, payload);

	console.log(`Vercel environment "${environment}" synced.`);
}

function fetchExistingEnvs(projectId: string, orgId: string, token: string): VercelEnv[] {
	const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);

	const proc = Bun.spawnSync({
		cmd: [
			"curl",
			"-s",
			"-X",
			"GET",
			"-H",
			`Authorization: Bearer ${token}`,
			"-H",
			"Content-Type: application/json",
			url.toString(),
		],
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		const stderr = new TextDecoder().decode(proc.stderr).trim();
		throw new Error(`Failed to fetch Vercel envs: ${stderr}`);
	}

	const body = JSON.parse(new TextDecoder().decode(proc.stdout)) as {
		envs?: VercelEnv[];
	};
	return body.envs ?? [];
}

function deleteExistingEnvs(projectId: string, orgId: string, token: string, ids: string[]) {
	if (ids.length === 0) return;

	const url = new URL(`https://api.vercel.com/v1/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);

	const body = JSON.stringify({
		ids,
	});

	const proc = Bun.spawnSync({
		cmd: [
			"curl",
			"-s",
			"-X",
			"DELETE",
			"-H",
			`Authorization: Bearer ${token}`,
			"-H",
			"Content-Type: application/json",
			"-d",
			body,
			url.toString(),
		],
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		const stderr = new TextDecoder().decode(proc.stderr).trim();
		throw new Error(`Failed to delete Vercel envs: ${stderr}`);
	}
}

function createEnvs(
	projectId: string,
	orgId: string,
	token: string,
	payload: Array<{
		key: string;
		target: readonly string[];
		type: "plain" | "sensitive";
		value: string;
	}>,
) {
	const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);
	url.searchParams.set("upsert", "true");

	const body = JSON.stringify(payload);

	const proc = Bun.spawnSync({
		cmd: [
			"curl",
			"-s",
			"-X",
			"POST",
			"-H",
			`Authorization: Bearer ${token}`,
			"-H",
			"Content-Type: application/json",
			"-d",
			body,
			url.toString(),
		],
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		const stderr = new TextDecoder().decode(proc.stderr).trim();
		throw new Error(`Failed to create Vercel envs: ${stderr}`);
	}

	const response = JSON.parse(new TextDecoder().decode(proc.stdout)) as {
		failed?: unknown[];
	};
	if (Array.isArray(response.failed) && response.failed.length > 0) {
		throw new Error(`Vercel reported ${response.failed.length} failed env operations.`);
	}
}

function listGhNames(cmd: string[]) {
	const stdout = runGh(cmd);

	return stdout
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
}

function runGh(cmd: string[]) {
	const proc = Bun.spawnSync({
		cmd,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		const stderr = new TextDecoder().decode(proc.stderr).trim();
		throw new Error(stderr || `Command failed: ${cmd.join(" ")}`);
	}

	return new TextDecoder().decode(proc.stdout).trim();
}

async function main() {
	const envInput = process.argv[2];
	const vercelProjectId = process.argv[3];

	if (envInput === "--help" || envInput === "-h") {
		printUsage(undefined, 0);
	}

	if (!envInput || !vercelProjectId) {
		printUsage("Missing environment name or Vercel project ID.", 1);
	}

	const filePath = resolveEnvFilePath(envInput);
	const parsedEnvFile = parseEnvFile(filePath);

	console.log(
		`Syncing "${parsedEnvFile.environment}" environment to GitHub and Vercel (${vercelProjectId})...`,
	);

	await Promise.all([
		syncGitHub(parsedEnvFile),
		syncVercel(parsedEnvFile, vercelProjectId),
	]);

	console.log(`Environment "${parsedEnvFile.environment}" synced to GitHub and Vercel.`);
}

try {
	await main();
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);
	process.exit(1);
}
