import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import {
	type DialectContextFx,
	MigrationContextFx,
	withDatabaseFx,
	withDatabaseName,
	withDialectFx,
} from "@/lib/common/database";
import { ensureDocker } from "../docker/ensureDocker";
import { rmImage } from "../docker/rmImage";
import { runImage } from "../docker/runImage";
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
		image: name,
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
			POSTGRES_DB: db,
		},
		port: [
			`127.0.0.1:${port}:5432`,
		],
		message: "Failed to start Postgres container (port busy?)",
	});

	try {
		await waitForConnect(
			withDatabaseName({
				dsn: `postgresql://postgres:postgres@127.0.0.1:${port}`,
				name: db,
			}),
		);
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
		onMigrate?: (database: withDatabaseFx.Instance<any>) => Promise<void>;
	}
}

export const withTestabaseFx = Effect.fn("withTestabaseFx")(function* ({
	image,
	name,
	port,
	template,
	databaseFx,
	onMigrate,
}: withTestabaseFx.Props) {
	ensureDocker();
	const root = "bootstrap";

	yield* Effect.promise(async () => {
		return startPostgresContainer({
			image,
			name,
			port,
			db: root,
		});
	});

	const dsn = `postgresql://postgres:postgres@127.0.0.1:${port}`;

	yield* Effect.gen(function* () {
		const { kysely } = yield* withDatabaseFx({}).pipe(
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseName({
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
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseName({
							dsn: dsn,
							name: template,
						}),
						application_name: `withTestabase:template-migrate:${template}`,
					}),
				}),
			),
		);
		const { kysely, migrate } = database;

		yield* Effect.promise(async () => {
			await migrate();
			await onMigrate?.(database);
			await kysely.destroy();
		});
	});

	yield* Effect.gen(function* () {
		const { kysely } = yield* withDatabaseFx({}).pipe(
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseName({
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
		rmImage({
			image: name,
		});
	};
});
