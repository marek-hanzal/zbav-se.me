import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type EnvMap = Record<string, string>;

interface ParsedEnvFile {
	environment: string;
	variables: EnvMap;
	secrets: EnvMap;
}

interface VercelEnvResponse {
	envs?: VercelEnv[];
}

interface VercelEnvOperationResponse {
	failed?: unknown[];
}

interface VercelEnvPayload {
	key: string;
	target: readonly string[];
	type: "plain" | "sensitive";
	value: string;
}

interface VercelEnv {
	id: string;
	key: string;
	system?: boolean;
	target?: string[];
}

const REPO = "marek-hanzal/zbav-se.me";
const ENV_DIRECTORY = "@env";

function printUsageFn(reason?: string, exitCode = 1): never {
	const availableEnvironments = listAvailableEnvironmentsFn();

	if (reason) {
		console.error(reason);
		console.error("");
	}

	console.error("Usage: argc env:sync <environment> <vercel-project-id>");
	console.error("");
	console.error(`Available environments: ${availableEnvironments.join(", ") || "(none found)"}`);
	console.error("");
	console.error("Examples:");

	for (const environment of availableEnvironments) {
		console.error(`  argc env:sync ${environment} prj_xxx`);
	}

	process.exit(exitCode);
}

function listAvailableEnvironmentsFn() {
	const absoluteDirectory = path.resolve(process.cwd(), ENV_DIRECTORY);

	if (!existsSync(absoluteDirectory)) {
		return [];
	}

	return readdirSync(absoluteDirectory)
		.filter((entry) => entry.endsWith(".json"))
		.map((entry) => path.basename(entry, ".json"))
		.sort((left, right) => left.localeCompare(right));
}

function resolveEnvFilePathFn(input: string) {
	const absolutePath = path.resolve(process.cwd(), ENV_DIRECTORY, `${input}.json`);

	if (!existsSync(absolutePath)) {
		printUsageFn(`Environment file not found: ${absolutePath}`, 1);
	}

	return absolutePath;
}

function parseEnvFileFn(filePath: string): ParsedEnvFile {
	const source = readFileSync(filePath, "utf8");
	const parsed = JSON.parse(source) as Partial<Pick<ParsedEnvFile, "variables" | "secrets">>;
	const variables = withEnvMapFn(parsed.variables);
	const secrets = withEnvMapFn(parsed.secrets);

	return {
		environment: path.basename(filePath, ".json"),
		variables,
		secrets,
	};
}

function withEnvMapFn(source: unknown): EnvMap {
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

function syncGitHubFn(parsedEnvFile: ParsedEnvFile) {
	const { environment, variables, secrets } = parsedEnvFile;

	console.log(`Syncing GitHub environment "${environment}"...`);

	const existingVars = listGhNamesFn([
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

	const existingSecs = listGhNamesFn([
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
		runGhFn([
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
		runGhFn([
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
		runGhFn([
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
		runGhFn([
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

async function syncVercelFn(parsedEnvFile: ParsedEnvFile, projectId: string) {
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

	const existingEnvs = fetchExistingEnvsFn(projectId, orgId, token);
	const existingToDelete = existingEnvs.filter(
		(env) => env.system !== true && env.target?.includes(target),
	);

	if (existingToDelete.length > 0) {
		console.log(`Deleting ${existingToDelete.length} existing Vercel envs...`);
		deleteExistingEnvsFn(
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
	createEnvsFn(projectId, orgId, token, payload);

	console.log(`Vercel environment "${environment}" synced.`);
}

function fetchExistingEnvsFn(projectId: string, orgId: string, token: string): VercelEnv[] {
	const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);

	const proc = spawnSync(
		"curl",
		[
			"-s",
			"-X",
			"GET",
			"-H",
			`Authorization: Bearer ${token}`,
			"-H",
			"Content-Type: application/json",
			url.toString(),
		],
		{
			encoding: "utf8",
		},
	);

	if (proc.status !== 0) {
		const stderr = proc.error?.message ?? proc.stderr?.trim() ?? "Command failed.";
		throw new Error(`Failed to fetch Vercel envs: ${stderr}`);
	}

	const body = JSON.parse(proc.stdout) as VercelEnvResponse;
	return body.envs ?? [];
}

function deleteExistingEnvsFn(projectId: string, orgId: string, token: string, ids: string[]) {
	if (ids.length === 0) return;

	const url = new URL(`https://api.vercel.com/v1/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);

	const body = JSON.stringify({
		ids,
	});

	const proc = spawnSync(
		"curl",
		[
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
		{
			encoding: "utf8",
		},
	);

	if (proc.status !== 0) {
		const stderr = proc.error?.message ?? proc.stderr?.trim() ?? "Command failed.";
		throw new Error(`Failed to delete Vercel envs: ${stderr}`);
	}
}

function createEnvsFn(
	projectId: string,
	orgId: string,
	token: string,
	payload: VercelEnvPayload[],
) {
	const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/env`);
	url.searchParams.set("teamId", orgId);
	url.searchParams.set("upsert", "true");

	const body = JSON.stringify(payload);

	const proc = spawnSync(
		"curl",
		[
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
		{
			encoding: "utf8",
		},
	);

	if (proc.status !== 0) {
		const stderr = proc.error?.message ?? proc.stderr?.trim() ?? "Command failed.";
		throw new Error(`Failed to create Vercel envs: ${stderr}`);
	}

	const response = JSON.parse(proc.stdout) as VercelEnvOperationResponse;
	if (Array.isArray(response.failed) && response.failed.length > 0) {
		throw new Error(`Vercel reported ${response.failed.length} failed env operations.`);
	}
}

function listGhNamesFn(cmd: string[]) {
	const stdout = runGhFn(cmd);

	return stdout
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
}

function runGhFn(cmd: string[]) {
	const [command, ...args] = cmd;
	if (!command) throw new Error("Missing command.");
	const proc = spawnSync(command, args, {
		encoding: "utf8",
	});

	if (proc.status !== 0) {
		const stderr = proc.error?.message ?? proc.stderr?.trim() ?? "Command failed.";
		throw new Error(stderr || `Command failed: ${command}`);
	}

	return proc.stdout.trim();
}

async function mainFn() {
	const envInput = process.argv[2];
	const vercelProjectId = process.argv[3];

	if (envInput === "--help" || envInput === "-h") {
		printUsageFn(undefined, 0);
	}

	if (!envInput || !vercelProjectId) {
		printUsageFn("Missing environment name or Vercel project ID.", 1);
	}

	const filePath = resolveEnvFilePathFn(envInput);
	const parsedEnvFile = parseEnvFileFn(filePath);

	console.log(
		`Syncing "${parsedEnvFile.environment}" environment to GitHub and Vercel (${vercelProjectId})...`,
	);

	await Promise.all([
		syncGitHubFn(parsedEnvFile),
		syncVercelFn(parsedEnvFile, vercelProjectId),
	]);

	console.log(`Environment "${parsedEnvFile.environment}" synced to GitHub and Vercel.`);
}

try {
	await mainFn();
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);
	process.exit(1);
}
