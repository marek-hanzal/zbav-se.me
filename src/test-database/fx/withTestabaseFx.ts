import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { ensureDockerFn } from "~/docker/fn/ensureDockerFn";
import { rmImageFn } from "~/docker/fn/rmImageFn";
import { runImageFn } from "~/docker/fn/runImageFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { shOptionalFn } from "~/shell/fn/shOptionalFn";
import { waitForConnectFn } from "~/test-database/fn/waitForConnectFn";

export namespace startPostgresContainerFn {
	export interface Props {
		image: string;
		name: string;
		port: number;
		db: string;
	}
}

async function startPostgresContainerFn({ image, name, port, db }: startPostgresContainerFn.Props) {
	rmImageFn({
		image: name,
	});

	runImageFn({
		image,
		name,
		props: {
			"--tmpfs": "/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
		},
		env: {
			POSTGRES_USER: "postgres",
			POSTGRES_PASSWORD: "postgres",
			POSTGRES_DB: db,
		},
		port: [
			`127.0.0.1:${port}:5432`,
		],
		message: "Failed to start Postgres container (port busy?)",
	});

	try {
		await waitForConnectFn(
			withDatabaseNameFn({
				dsn: `postgresql://postgres:postgres@127.0.0.1:${port}`,
				name: db,
			}),
		);
	} catch (error) {
		const logs = shOptionalFn([
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
		onMigrateFn?: (database: withDatabaseFx.Instance<any>) => Promise<void>;
	}
}

export const withTestabaseFx = Effect.fn("withTestabaseFx")(function* ({
	image,
	name,
	port,
	template,
	databaseFx,
	onMigrateFn,
}: withTestabaseFx.Props) {
	ensureDockerFn();
	const root = "bootstrap";

	yield* Effect.promise(async () => {
		return startPostgresContainerFn({
			image,
			name,
			port,
			db: root,
		});
	});

	const dsn = `postgresql://postgres:postgres@127.0.0.1:${port}`;

	yield* Effect.gen(function* () {
		const { kysely } = yield* withDatabaseFx({
			logger: getRootLoggerFn([
				"db",
			]),
		}).pipe(
			withDialectFn(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseNameFn({
							dsn: dsn,
							name: root,
						}),
						application_name: `withTestabase:template-bootstrap:${template}`,
					}),
				}),
			),
			Effect.provideService(MigrationContextFx, {}),
		);

		yield* Effect.promise(async () => {
			await sql`DROP DATABASE IF EXISTS ${sql.ref(template)}`.execute(kysely);
			await sql`CREATE DATABASE ${sql.ref(template)}`.execute(kysely);
			await kysely.destroy();
		});
	});

	yield* Effect.gen(function* () {
		const database = yield* databaseFx.pipe(
			withDialectFn(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseNameFn({
							dsn: dsn,
							name: template,
						}),
						application_name: `withTestabase:template-migrate:${template}`,
					}),
				}),
			),
		);
		const { kysely, migrateFn } = database;

		yield* Effect.promise(async () => {
			await migrateFn();
			await onMigrateFn?.(database);
			await kysely.destroy();
		});
	});

	yield* Effect.gen(function* () {
		const { kysely } = yield* withDatabaseFx({
			logger: getLogger("test"),
		}).pipe(
			withDialectFn(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseNameFn({
							dsn: dsn,
							name: "postgres",
						}),
						application_name: `withTestabase:template-admin:${template}`,
					}),
				}),
			),
			Effect.provideService(MigrationContextFx, {}),
		);

		yield* Effect.promise(async () => {
			await sql`ALTER DATABASE ${sql.ref(template)} WITH IS_TEMPLATE = true;`.execute(kysely);

			/**
			 * This ensures early we're able to create new databases from the template.
			 */
			await sql`CREATE DATABASE dummy TEMPLATE ${sql.ref(template)};`.execute(kysely);
			await sql`ALTER DATABASE ${sql.ref(template)} WITH ALLOW_CONNECTIONS = false;`.execute(
				kysely,
			);
			await kysely.destroy();
		});
	});

	process.env.SERVER_DATABASE_URL = dsn;

	return async () => {
		rmImageFn({
			image: name,
		});
	};
});
