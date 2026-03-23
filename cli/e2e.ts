const IMAGE = "nhost/postgres:17-20260320-1";
const CONTAINER_NAME = "zbav-seme-e2e-postgres";
const VOLUME_NAME = "zbav-seme-e2e-postgres-data";
const SEED_DATABASE = "e2e_seed";
const TEST_DATABASE = "e2e";
const DATABASE_PORT = 56432;
const DATABASE_USER = "postgres";
const DATABASE_PASSWORD = "e2e";
const POSTGRES_DATABASE = "postgres";
const DATABASE_HOST_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@127.0.0.1:${DATABASE_PORT}`;
const DATABASE_URL = `${DATABASE_HOST_URL}/${TEST_DATABASE}`;
const APP_URL = "http://zbav-se.me.localhost:1355";
const API_URL = "http://api.zbav-se.me.localhost:1355";
const PREVIEW_READY_TIMEOUT_MS = 120_000;

type Spawned = ReturnType<typeof Bun.spawn>;

let preview: Spawned | null = null;
let cleaningUp = false;

function withCommandOutput(proc: ReturnType<typeof Bun.spawnSync>) {
	const stdout = proc.stdout ? new TextDecoder().decode(proc.stdout).trim() : "";
	const stderr = proc.stderr ? new TextDecoder().decode(proc.stderr).trim() : "";

	return {
		stdout,
		stderr,
	};
}

function run(cmd: string[], hint: string, env: NodeJS.ProcessEnv = process.env) {
	const proc = Bun.spawnSync({
		cmd,
		env,
		stdout: "pipe",
		stderr: "pipe",
	});
	const { stdout, stderr } = withCommandOutput(proc);

	if (proc.exitCode !== 0) {
		throw new Error(
			[
				hint,
				stderr,
				stdout,
			]
				.filter(Boolean)
				.join("\n\n"),
		);
	}

	return {
		stdout,
	};
}

function runOptional(cmd: string[], env: NodeJS.ProcessEnv = process.env) {
	const proc = Bun.spawnSync({
		cmd,
		env,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		return null;
	}

	return withCommandOutput(proc);
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPostgres(timeoutMs = 15_000) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		const result = runOptional([
			"docker",
			"exec",
			CONTAINER_NAME,
			"pg_isready",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
		]);

		if (result?.stdout.includes("accepting connections")) {
			return;
		}

		await sleep(100);
	}

	throw new Error("E2E Postgres container did not become ready in time");
}

async function waitForDatabase(database: string, timeoutMs = 15_000) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		const result = runOptional([
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			database,
			"-c",
			"SELECT 1;",
		]);

		if (result?.stdout.includes("1 row")) {
			return;
		}

		await sleep(100);
	}

	throw new Error(`Database "${database}" did not become ready in time`);
}

function ensureDocker() {
	run(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);
}

function ensureE2eVolume() {
	runOptional([
		"docker",
		"volume",
		"rm",
		"-f",
		VOLUME_NAME,
	]);

	run(
		[
			"docker",
			"volume",
			"create",
			VOLUME_NAME,
		],
		"Failed to create the dedicated E2E Docker volume",
	);
}

function replacePostgresContainer() {
	runOptional([
		"docker",
		"rm",
		"-f",
		CONTAINER_NAME,
	]);

	run(
		[
			"docker",
			"run",
			"-d",
			"--name",
			CONTAINER_NAME,
			"--restart",
			"unless-stopped",
			"-v",
			`${VOLUME_NAME}:/var/lib/postgresql/data`,
			"-e",
			`POSTGRES_USER=${DATABASE_USER}`,
			"-e",
			`POSTGRES_PASSWORD=${DATABASE_PASSWORD}`,
			"-e",
			`POSTGRES_DB=${POSTGRES_DATABASE}`,
			"-p",
			`127.0.0.1:${DATABASE_PORT}:5432`,
			IMAGE,
		],
		"Failed to start the dedicated E2E Postgres container",
	);
}

function ensureE2eDatabase() {
	run(
		[
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
			"-c",
			[
				"SELECT pg_terminate_backend(pid)",
				"FROM pg_stat_activity",
				`WHERE datname IN ('${SEED_DATABASE}', '${TEST_DATABASE}')`,
				"AND pid <> pg_backend_pid();",
			].join(" "),
		],
		"Failed to terminate existing E2E database connections",
	);

	run(
		[
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
			"-c",
			`DROP DATABASE IF EXISTS ${TEST_DATABASE};`,
		],
		"Failed to drop the E2E database",
	);

	run(
		[
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
			"-c",
			`DROP DATABASE IF EXISTS ${SEED_DATABASE};`,
		],
		"Failed to drop the E2E seed database",
	);

	run(
		[
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
			"-c",
			`CREATE DATABASE ${SEED_DATABASE} OWNER ${DATABASE_USER};`,
		],
		"Failed to create the E2E seed database",
	);

	run(
		[
			"docker",
			"exec",
			CONTAINER_NAME,
			"psql",
			"-U",
			DATABASE_USER,
			"-d",
			POSTGRES_DATABASE,
			"-c",
			`CREATE DATABASE ${TEST_DATABASE} OWNER ${DATABASE_USER};`,
		],
		"Failed to create the E2E database",
	);
}

function withE2eEnv(): NodeJS.ProcessEnv {
	return {
		...process.env,
		SERVER_DATABASE_URL: DATABASE_URL,
		VITE_ORIGIN: APP_URL,
		VITE_SERVER_API: API_URL,
		VITE_APP_ASSETS: "/",
		E2E_APP_URL: APP_URL,
		E2E_API_URL: API_URL,
	};
}

async function waitForHttp(url: string, hint: string) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < PREVIEW_READY_TIMEOUT_MS) {
		const result = runOptional([
			"curl",
			"-fsS",
			"-o",
			"/dev/null",
			"-L",
			url,
		]);

		if (result) {
			return;
		}

		await sleep(250);
	}

	throw new Error(hint);
}

async function runMigration(env: NodeJS.ProcessEnv, timeoutMs = 30_000) {
	const startedAt = Date.now();
	let lastError = "Unknown migration error";

	while (Date.now() - startedAt < timeoutMs) {
		const proc = Bun.spawnSync({
			cmd: [
				"curl",
				"-sS",
				"-X",
				"POST",
				"-w",
				"\\n%{http_code}",
				`${API_URL}/api/public/migration/run`,
			],
			env,
			stdout: "pipe",
			stderr: "pipe",
		});
		const { stdout, stderr } = withCommandOutput(proc);
		const lines = stdout.split("\n");
		const status = lines.pop()?.trim();
		const body = lines.join("\n").trim();

		if (proc.exitCode === 0 && status === "200") {
			return;
		}

		lastError = [
			stderr,
			body,
			status ? `HTTP ${status}` : "",
		]
			.filter(Boolean)
			.join("\n\n");
		await sleep(250);
	}

	throw new Error(
		[
			"Failed to run server migrations for the E2E database",
			lastError,
		]
			.filter(Boolean)
			.join("\n\n"),
	);
}

async function stopPreview() {
	if (!preview) {
		return;
	}

	try {
		preview.kill();
		await sleep(500);
	} catch {
		//
	}
}

async function cleanup() {
	if (cleaningUp) {
		return;
	}

	cleaningUp = true;

	await stopPreview();
	runOptional([
		"docker",
		"rm",
		"-f",
		CONTAINER_NAME,
	]);
}

const env = withE2eEnv();

for (const signal of [
	"SIGINT",
	"SIGTERM",
	"SIGHUP",
] as const) {
	process.on(signal, () => {
		void cleanup().finally(() => {
			process.exit(1);
		});
	});
}

try {
	ensureDocker();
	ensureE2eVolume();
	replacePostgresContainer();
	await waitForPostgres();
	ensureE2eDatabase();
	await waitForDatabase(TEST_DATABASE);

	preview = Bun.spawn(
		[
			"zsh",
			"-lc",
			"trap 'kill 0' TERM INT EXIT; bun run preview",
		],
		{
			env,
			stdout: "inherit",
			stderr: "inherit",
		},
	);

	await waitForHttp(`${API_URL}/api/public/health`, "Preview API did not become ready in time");
	await runMigration(env);
	await waitForHttp(APP_URL, "Preview app did not become ready in time");

	const tests = Bun.spawnSync({
		cmd: [
			"zsh",
			"-lc",
			"cd apps/e2e && bun run e2e",
		],
		env,
		stdout: "inherit",
		stderr: "inherit",
	});

	if (tests.exitCode !== 0) {
		process.exitCode = tests.exitCode;
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
} finally {
	await cleanup();
	process.exit(process.exitCode ?? 0);
}
