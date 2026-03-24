import { DialectContextFx } from "@use-pico/common/database";
import { ensureDocker, rmImage, runImage } from "@use-pico/server/docker";
import { waitForConnect } from "@use-pico/server/pg";
import { shOptional } from "@use-pico/server/sh";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

const IMAGE = "nhost/postgres:17-20260320-1";
const CONTAINER_NAME = "zbav-seme-test-postgres";
const SEED_DATABASE = "dummy";
const TEST_DATABASE = "test";

const DATABASE_PORT = 55432;
const DATABASE_URL = `postgresql://postgres:test@127.0.0.1:${DATABASE_PORT}`;

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
	rmImage({
		image: CONTAINER_NAME,
	});

	runImage({
		image: IMAGE,
		name: CONTAINER_NAME,
		props: {
			"--tmpfs": "/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
		},
		env: {
			POSTGRES_USER: "postgres",
			POSTGRES_PASSWORD: "test",
			POSTGRES_DB: SEED_DATABASE,
		},
		port: [
			`127.0.0.1:${DATABASE_PORT}:5432`,
		],
		message: "Failed to start Postgres container (port busy?)",
	});

	try {
		await waitForConnect(`${DATABASE_URL}/${SEED_DATABASE}`);
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

export default async function globalSetup() {
	await Effect.gen(function* () {
		const { kysely, migrate } = yield* database;

		ensureDocker();

		yield* Effect.promise(async () => {
			await ensurePostgresContainer();
			await ensureTestDatabase();
		});

		process.env.SERVER_DATABASE_URL = DATABASE_URL;

		yield* Effect.promise(async () => {
			await migrate();
			return kysely.destroy();
		});

		return async () => {
			rmImage({
				image: CONTAINER_NAME,
			});
		};
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
}
