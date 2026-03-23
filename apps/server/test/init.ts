import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

type SetupResult = (() => Promise<void>) | void;
type ContainerState = {
	health: string | null;
	image: string;
	running: boolean;
};

const IMAGE = "nhost/postgres:17-20260320-1";
const CONTAINER_NAME = "zbav-seme-test-postgres";
const SEED_DATABASE = "dummy";
const TEST_DATABASE = "test";

const DATABASE_PORT = 55432;
const DATABASE_URL = `postgresql://postgres:test@127.0.0.1:${DATABASE_PORT}`;

function sh(cmd: string[], hint: string) {
	const proc = Bun.spawnSync({
		cmd,
		stdout: "pipe",
		stderr: "pipe",
	});
	const stdout = new TextDecoder().decode(proc.stdout).trim();
	const stderr = new TextDecoder().decode(proc.stderr).trim();
	if (proc.exitCode !== 0) {
		throw new Error(`${hint}\n${stderr}`.trim());
	}
	return {
		stdout,
	};
}

function shQuiet(cmd: string[]) {
	Bun.spawnSync({
		cmd,
		stdout: "ignore",
		stderr: "ignore",
	});
}

function shOptional(cmd: string[]) {
	const proc = Bun.spawnSync({
		cmd,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		return null;
	}

	return {
		stdout: new TextDecoder().decode(proc.stdout).trim(),
	};
}

function containerLogs(name: string) {
	return (
		shOptional([
			"docker",
			"logs",
			name,
		])?.stdout ?? ""
	);
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

async function waitForPostgresConnect(dsn: string, timeoutMs = 15_000) {
	const started = Date.now();
	let lastError = "unknown";

	while (Date.now() - started < timeoutMs) {
		try {
			const client = new Client({
				connectionString: dsn,
				connectionTimeoutMillis: 250,
			});
			await client.connect();
			await client.query("select 1");
			await client.end();
			return;
		} catch (error) {
			lastError = error instanceof Error ? error.message : String(error);
			await sleep(75);
		}
	}
	throw new Error(`Postgres not accepting connections: ${dsn}\n${lastError}`);
}

async function ensureTestDatabase() {
	const client = new Client({
		connectionString: `${DATABASE_URL}/postgres`,
	});

	await client.connect();

	try {
		await client.query(
			`
				SELECT pg_terminate_backend(pid)
				FROM pg_stat_activity
				WHERE datname = $1
					AND pid <> pg_backend_pid()
			`,
			[
				TEST_DATABASE,
			],
		);
		await client.query(`DROP DATABASE IF EXISTS ${TEST_DATABASE}`);
		await client.query(`CREATE DATABASE ${TEST_DATABASE} OWNER postgres`);
	} finally {
		await client.end();
	}
}

async function sealTestDatabase() {
	const client = new Client({
		connectionString: `${DATABASE_URL}/postgres`,
	});

	await client.connect();

	try {
		await client.query(
			`
				SELECT pg_terminate_backend(pid)
				FROM pg_stat_activity
				WHERE datname = $1
					AND pid <> pg_backend_pid()
			`,
			[
				TEST_DATABASE,
			],
		);
		await client.query(`ALTER DATABASE ${TEST_DATABASE} WITH ALLOW_CONNECTIONS false`);
		await client.query(
			`
				UPDATE pg_database
				SET datistemplate = true
				WHERE datname = $1
			`,
			[
				TEST_DATABASE,
			],
		);
	} finally {
		await client.end();
	}
}

async function waitForContainerHealthy(name: string, timeoutMs = 15_000) {
	const started = Date.now();

	while (Date.now() - started < timeoutMs) {
		const state = inspectContainer(name);

		if (!state?.running) {
			break;
		}

		if (state.health === null || state.health === "healthy") {
			return;
		}

		await sleep(75);
	}

	const logs = containerLogs(name);

	throw new Error(
		[
			`Postgres container "${name}" did not become healthy in time.`,
			logs && `Container logs:\n${logs}`,
		]
			.filter(Boolean)
			.join("\n\n"),
	);
}

function inspectContainer(name: string): ContainerState | null {
	const result = shOptional([
		"docker",
		"inspect",
		name,
		"--format",
		"{{.Config.Image}}\t{{.State.Running}}\t{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}",
	]);

	if (!result) {
		return null;
	}

	const [image = "", running = "false", health = "none"] = result.stdout.split("\t");

	return {
		health: health === "none" ? null : health,
		image,
		running: running === "true",
	};
}

async function ensurePostgresContainer() {
	if (inspectContainer(CONTAINER_NAME)) {
		shQuiet([
			"docker",
			"rm",
			"-f",
			CONTAINER_NAME,
		]);
	}

	sh(
		[
			"docker",
			"run",
			"-d",
			"--name",
			CONTAINER_NAME,
			"--rm",
			"--tmpfs",
			"/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
			"--health-cmd",
			"pg_isready -U postgres -d postgres",
			"--health-interval",
			"500ms",
			"--health-timeout",
			"2s",
			"--health-retries",
			"20",
			"--health-start-period",
			"500ms",
			"-e",
			"POSTGRES_USER=postgres",
			"-e",
			"POSTGRES_PASSWORD=test",
			"-e",
			`POSTGRES_DB=${SEED_DATABASE}`,
			"-p",
			`127.0.0.1:${DATABASE_PORT}:5432`,
			IMAGE,
		],
		"Failed to start Postgres container (port busy?)",
	);

	await waitForContainerHealthy(CONTAINER_NAME);
	await waitForPostgresConnect(`${DATABASE_URL}/${SEED_DATABASE}`);
}

export default async function globalSetup(): Promise<SetupResult> {
	sh(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);

	await ensurePostgresContainer();
	await ensureTestDatabase();

	process.env.SERVER_DATABASE_URL = DATABASE_URL;

	await Effect.gen(function* () {
		const { kysely, migrate } = yield* database;

		yield* Effect.promise(async () => migrate());

		yield* Effect.promise(async () => kysely.destroy());
	}).pipe(
		Effect.provideService(
			DialectContextFx,
			new PostgresDialect({
				pool: new Pool({
					connectionString: `${DATABASE_URL}/${TEST_DATABASE}`,
				}),
			}),
		),
		Effect.runPromise,
	);

	await sealTestDatabase();

	return async () => {
		shQuiet([
			"docker",
			"rm",
			"-f",
			"-v",
			CONTAINER_NAME,
		]);
	};
}
