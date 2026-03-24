import { DialectContextFx, MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { ensureDocker } from "../docker/ensureDocker";
import { rmImage } from "../docker/rmImage";
import { runImage } from "../docker/runImage";
import { terminateClientBackends } from "../pg/terminateClientBackends";
import { waitForConnect } from "../pg/waitForConnect";
import { shOptional } from "../sh/shOptional";

export namespace startPostgresContainer {
	export interface Props {
		image: string;
		name: string;
		port: number;
		db: string;
	}
}

async function startPostgresContainer({ image, name, port, db }: startPostgresContainer.Props) {
	rmImage({
		image,
	});

	runImage({
		image,
		name,
		props: {
			"--tmpfs": "/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
		},
		env: {
			POSTGRES_USER: "postgres",
			POSTGRES_PASSWORD: "postgres",
			POSTGRES_DB: "test",
		},
		port: [
			`127.0.0.1:${port}:5432`,
		],
		message: "Failed to start Postgres container (port busy?)",
	});

	try {
		await waitForConnect(`postgresql://postgres:postgres@127.0.0.1:${port}/${db}`);
	} catch (error) {
		const logs = shOptional([
			"docker",
			"logs",
			name,
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

export namespace withTestabaseFx {
	export interface Props {
		image: string;
		name: string;
		port: number;
		template: string;
		databaseFx: Effect.Effect<withDatabaseFx.Instance<any>, never, DialectContextFx>;
	}
}

export const withTestabaseFx = Effect.fn("withTestabaseFx")(function* ({
	image,
	name,
	port,
	template,
	databaseFx,
}: withTestabaseFx.Props) {
	ensureDocker();

	yield* Effect.promise(async () => {
		return startPostgresContainer({
			image,
			name,
			port,
			db: template,
		});
	});

	const dsn = `postgresql://postgres:postgres@127.0.0.1:${port}`;

	yield* Effect.gen(function* () {
		const { kysely, migrate } = yield* databaseFx.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${dsn}/${template}`,
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
		const { kysely } = yield* withDatabaseFx({}).pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${dsn}/postgres`,
					}),
				}),
			),
			Effect.provideService(MigrationContextFx, {}),
		);

		yield* Effect.promise(async () => {
			await sql`ALTER DATABASE ${sql.ref(template)} WITH IS_TEMPLATE = true ALLOW_CONNECTIONS = false;`.execute(
				kysely,
			);

			await sql`
                SELECT
                    pg_terminate_backend(pid, 5000)
                FROM
                    pg_stat_activity
                WHERE
                    datname = ${template}
                    AND
                    pid <> pg_backend_pid()
            `.execute(kysely);

			/**
			 * This just ensures early we're able to create new databases from template
			 */
			await sql`CREATE DATABASE dummy TEMPLATE ${sql.ref(template)};`.execute(kysely);

			await kysely.destroy();
		});
	});

	process.env.SERVER_DATABASE_URL = dsn;

	return async () => {
		await terminateClientBackends(`${dsn}/postgres`);

		rmImage({
			image: name,
		});
	};
});
