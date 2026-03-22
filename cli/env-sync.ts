import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type EnvMap = Record<string, string>;
type Section = "variables" | "secrets";

interface ParsedEnvFile {
	environment: string;
	filePath: string;
	variables: EnvMap;
	secrets: EnvMap;
}

interface ParsedEntry {
	key: string;
	value: string;
}

const REPO = "marek-hanzal/zbav-se.me";
const ENV_DIRECTORY = "@env";

try {
	main();
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);
	process.exit(1);
}

function main() {
	const input = process.argv[2];

	if (!input) {
		printUsage("Missing environment name.", 1);
	}

	if (input === "--help" || input === "-h") {
		printUsage(undefined, 0);
	}

	const filePath = resolveEnvFilePath(input);
	const parsedEnvFile = parseEnvFile(filePath);

	console.log(
		`Syncing GitHub Actions environment "${parsedEnvFile.environment}" from ${parsedEnvFile.filePath}`,
	);

	deleteRepoLevelKeys();
	deleteEnvironmentLevelKeys(parsedEnvFile.environment);
	setEnvironmentLevelKeys(parsedEnvFile);

	console.log(
		`GitHub Actions environment "${parsedEnvFile.environment}" is now synced from ${parsedEnvFile.filePath}.`,
	);
}

function printUsage(reason?: string, exitCode = 1): never {
	if (reason) {
		console.error(reason);
		console.error("");
	}

	console.error("Usage: bun run env:sync <environment>");
	console.error("");
	console.error("Examples:");
	console.error("  bun run env:sync staging");
	console.error("  bun run env:sync production");
	console.error("  bun run env:sync staging.yaml");

	process.exit(exitCode);
}

function resolveEnvFilePath(input: string) {
	const fileName = input.endsWith(".yaml") ? input : `${input}.yaml`;
	const absolutePath = path.resolve(process.cwd(), ENV_DIRECTORY, fileName);

	if (!existsSync(absolutePath)) {
		printUsage(`Environment file not found: ${absolutePath}`, 1);
	}

	return absolutePath;
}

function parseEnvFile(filePath: string): ParsedEnvFile {
	const source = readFileSync(filePath, "utf8");
	const variables: EnvMap = {};
	const secrets: EnvMap = {};
	let section: Section | null = null;

	for (const rawLine of source.split("\n")) {
		const trimmedLine = rawLine.trim();

		if (!trimmedLine || trimmedLine.startsWith("#")) {
			continue;
		}

		if (!rawLine.startsWith(" ")) {
			section = toSection(trimmedLine);
			continue;
		}

		if (!section) {
			continue;
		}

		const parsedEntry = parseEntry(trimmedLine);

		if (!parsedEntry) {
			continue;
		}

		if (section === "variables") {
			variables[parsedEntry.key] = parsedEntry.value;
			continue;
		}

		secrets[parsedEntry.key] = parsedEntry.value;
	}

	return {
		environment: path.basename(filePath, ".yaml"),
		filePath,
		variables,
		secrets,
	};
}

function toSection(line: string): Section | null {
	switch (line) {
		case "variables:":
			return "variables";
		case "secrets:":
			return "secrets";
		default:
			return null;
	}
}

function parseEntry(line: string): ParsedEntry | null {
	const separatorIndex = line.indexOf(":");

	if (separatorIndex === -1) {
		return null;
	}

	const key = line.slice(0, separatorIndex).trim();
	const rawValue = line.slice(separatorIndex + 1).trim();

	if (!key) {
		return null;
	}

	return {
		key,
		value: unwrapQuotedValue(rawValue),
	};
}

function unwrapQuotedValue(value: string) {
	if (value.startsWith('"') && value.endsWith('"')) {
		return value.slice(1, -1);
	}

	return value;
}

function deleteRepoLevelKeys() {
	for (const name of listGhNames([
		"gh",
		"variable",
		"list",
		"-R",
		REPO,
		"--json",
		"name",
		"-q",
		".[].name",
	])) {
		console.log(`Deleting repo variable ${name}`);
		runGh([
			"gh",
			"variable",
			"delete",
			name,
			"-R",
			REPO,
		]);
	}

	for (const name of listGhNames([
		"gh",
		"secret",
		"list",
		"-R",
		REPO,
		"--json",
		"name",
		"-q",
		".[].name",
	])) {
		console.log(`Deleting repo secret ${name}`);
		runGh([
			"gh",
			"secret",
			"delete",
			name,
			"-R",
			REPO,
		]);
	}
}

function deleteEnvironmentLevelKeys(environment: string) {
	for (const name of listGhNames([
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
	])) {
		console.log(`Deleting ${environment} variable ${name}`);
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

	for (const name of listGhNames([
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
	])) {
		console.log(`Deleting ${environment} secret ${name}`);
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
}

function setEnvironmentLevelKeys(parsedEnvFile: ParsedEnvFile) {
	for (const [name, value] of Object.entries(parsedEnvFile.variables)) {
		if (!value) {
			console.warn(`Skipping empty variable ${name} in ${parsedEnvFile.environment}.`);
			continue;
		}

		console.log(`Setting ${parsedEnvFile.environment} variable ${name}`);
		runGh([
			"gh",
			"variable",
			"set",
			name,
			"-R",
			REPO,
			"--env",
			parsedEnvFile.environment,
			"--body",
			value,
		]);
	}

	for (const [name, value] of Object.entries(parsedEnvFile.secrets)) {
		if (!value) {
			console.warn(`Skipping empty secret ${name} in ${parsedEnvFile.environment}.`);
			continue;
		}

		console.log(`Setting ${parsedEnvFile.environment} secret ${name}`);
		runGh([
			"gh",
			"secret",
			"set",
			name,
			"-R",
			REPO,
			"--env",
			parsedEnvFile.environment,
			"--body",
			value,
		]);
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
