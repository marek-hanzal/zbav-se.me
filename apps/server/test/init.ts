import { DialectContextFx } from "@use-pico/common/database";
import { ensureDocker, rmImage, runImage } from "@use-pico/server/docker";
import { waitForConnect } from "@use-pico/server/pg";
import { shOptional } from "@use-pico/server/sh";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

const config = {
	image: "nhost/postgres:17-20260320-1",
	name: "zbav-seme-test-postgres",
} as const;

const DATABASE_PORT = 55432;
const DATABASE_URL = `postgresql://postgres:postgres@127.0.0.1:${DATABASE_PORT}`;

async function terminateClientBackends() {
	const client = new Client({
		connectionString: `${DATABASE_URL}/postgres`,
	});

	await client.connect();

	try {
		await client.query(`
			SELECT
				pg_terminate_backend(pid)
			FROM
				pg_stat_activity
			WHERE
				pid <> pg_backend_pid()
				AND backend_type = 'client backend'
		`);
	} finally {
		await client.end();
	}
}

async function startPostgresContainer() {
	rmImage({
		image: config.image,
	});

	runImage({
		image: config.image,
		name: config.name,
		props: {
			"--tmpfs": "/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
		},
		env: {
			POSTGRES_USER: "postgres",
			POSTGRES_PASSWORD: "postgres",
			POSTGRES_DB: "test",
		},
		port: [
			`127.0.0.1:${DATABASE_PORT}:5432`,
		],
		message: "Failed to start Postgres container (port busy?)",
	});

	try {
		await waitForConnect(`${DATABASE_URL}/test`);
	} catch (error) {
		const logs = shOptional([
			"docker",
			"logs",
			config.name,
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
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			ensureDocker();

			await startPostgresContainer();
		});

		yield* Effect.gen(function* () {
			const { kysely, migrate } = yield* database.pipe(
				Effect.provideService(
					DialectContextFx,
					new PostgresDialect({
						pool: new Pool({
							connectionString: `${DATABASE_URL}/test`,
						}),
					}),
				),
			);

			yield* Effect.promise(async () => {
				await migrate();

				await kysely.destroy();
			});
		});

		yield* Effect.gen(function* () {
			const { kysely } = yield* database.pipe(
				Effect.provideService(
					DialectContextFx,
					new PostgresDialect({
						pool: new Pool({
							connectionString: `${DATABASE_URL}/postgres`,
						}),
					}),
				),
			);

			yield* Effect.promise(async () => {
				await sql`ALTER DATABASE test WITH IS_TEMPLATE = true ALLOW_CONNECTIONS = false;`.execute(
					kysely,
				);

				await sql`
                    SELECT
                        pg_terminate_backend(pid, 5000)
				    FROM
                        pg_stat_activity
				    WHERE
                        datname = ${"test"}
					    AND
                        pid <> pg_backend_pid()
                `.execute(kysely);

				await sql`CREATE DATABASE dummy TEMPLATE test;`.execute(kysely);
			});
		});

		process.env.SERVER_DATABASE_URL = DATABASE_URL;

		return async () => {
			await terminateClientBackends();
			rmImage({
				image: config.name,
			});
		};
	}).pipe(Effect.runPromise);
}
