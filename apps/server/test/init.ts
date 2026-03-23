import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

type SetupResult = (() => Promise<void>) | void;

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
		connectionString: `${DATABASE_URL}/${SEED_DATABASE}`,
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

async function ensurePostgresContainer() {
	shQuiet([
		"docker",
		"rm",
		"-f",
		CONTAINER_NAME,
	]);

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

	try {
		await waitForPostgresConnect(`${DATABASE_URL}/${SEED_DATABASE}`);
	} catch (error) {
		const logs = shOptional([
			"docker",
			"logs",
			CONTAINER_NAME,
		])?.stdout;

		throw new Error(
			[
				error instanceof Error ? error.message : String(error),
				logs ? `Container logs:\n${logs}` : "",
			]
				.filter(Boolean)
				.join("\n\n"),
		);
	}
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
