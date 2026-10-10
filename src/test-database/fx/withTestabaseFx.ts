import { randomUUID } from "node:crypto";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { ensureDockerFn } from "~/docker/fn/ensureDockerFn";
import { runImageFn } from "~/docker/fn/runImageFn";
import { shFn } from "~/shell/fn/shFn";
import { shOptionalFn } from "~/shell/fn/shOptionalFn";
import { waitForConnectFn } from "~/test-database/fn/waitForConnectFn";
import { withAdminDatabaseFn } from "~/test-database/fn/withAdminDatabaseFn";

export namespace withTestabaseFx {
	export interface Props<TDatabase> {
		image: string;
		/** Container prefix; every run receives its own unique name. */
		name: string;
		/** Omit to let Docker allocate an available loopback port. */
		port?: number;
		template: string;
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		onMigrateFn?: (database: withDatabaseFx.Instance<TDatabase>) => Promise<void>;
	}
}

export const withTestabaseFx = Effect.fn("withTestabaseFx")(function* <TDatabase>({
	image,
	name,
	port,
	template,
	databaseFx,
	onMigrateFn,
}: withTestabaseFx.Props<TDatabase>) {
	return yield* Effect.promise(async () => {
		ensureDockerFn();
		const containerName = `${name}-${randomUUID()}`;
		let started = false;
		let attempted = false;
		const findContainerFn = () =>
			shFn(
				[
					"docker",
					"ps",
					"--all",
					"--filter",
					`name=^/${containerName}$`,
					"--format",
					"{{.ID}}",
				],
				"Cannot inspect owned test Postgres container",
			).stdout;
		const cleanupFn = async () => {
			if (!attempted) return;
			const id = findContainerFn();
			if (id)
				shFn(
					[
						"docker",
						"rm",
						"-f",
						"-v",
						id,
					],
					"Cannot remove test Postgres container",
				);
			attempted = false;
		};

		try {
			if (findContainerFn())
				throw new Error(`Test container name already exists: ${containerName}`);
			// Docker can create a container and then fail to bind its port.
			attempted = true;
			runImageFn({
				image,
				name: containerName,
				flags: [
					"--tmpfs",
					"/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
				],
				env: {
					POSTGRES_USER: "postgres",
					POSTGRES_PASSWORD: "postgres",
					POSTGRES_DB: "bootstrap",
				},
				port: [
					`127.0.0.1:${port ?? ""}:5432`,
				],
				message: "Failed to start test Postgres container",
			});
			started = true;
			const binding = shFn(
				[
					"docker",
					"port",
					containerName,
					"5432/tcp",
				],
				"Cannot read test Postgres port",
			).stdout;
			const assignedPort = Number(binding.split(":").at(-1));
			if (!Number.isInteger(assignedPort) || assignedPort <= 0) {
				throw new Error(`Invalid test Postgres port binding: ${binding}`);
			}
			const dsn = `postgresql://postgres:postgres@127.0.0.1:${assignedPort}/postgres`;
			await waitForConnectFn(
				withDatabaseNameFn({
					dsn,
					name: "bootstrap",
				}),
			);

			const admin = withAdminDatabaseFn({
				dsn,
				root: "bootstrap",
				name: `bootstrap:${template}`,
			});
			try {
				await sql`CREATE DATABASE ${sql.id(template)}`.execute(admin);
				const pool = new Pool({
					connectionString: withDatabaseNameFn({
						dsn,
						name: template,
					}),
					application_name: `testabase:template:${template}`,
					max: 1,
				});
				try {
					const database = await databaseFx.pipe(
						withDialectFn(
							new PostgresDialect({
								pool,
							}),
						),
						Effect.runPromise,
					);
					try {
						await database.migrateFn();
						await onMigrateFn?.(database);
					} finally {
						await database.kysely.destroy();
					}
				} finally {
					if (!pool.ended) await pool.end();
				}
				await sql`ALTER DATABASE ${sql.id(template)} WITH IS_TEMPLATE = true ALLOW_CONNECTIONS = false`.execute(
					admin,
				);
				// Check cloning once, without leaving an unused database behind.
				await sql`CREATE DATABASE template_probe TEMPLATE ${sql.id(template)}`.execute(
					admin,
				);
				await sql`DROP DATABASE template_probe`.execute(admin);
			} finally {
				await admin.destroy();
			}
			return {
				dsn,
				containerName,
				cleanupFn,
			};
		} catch (error) {
			const logs = started
				? shOptionalFn([
						"docker",
						"logs",
						containerName,
					])?.stdout
				: undefined;
			const failure = new Error(
				`Test database bootstrap failed${logs ? `\nContainer logs:\n${logs}` : ""}`,
				{
					cause: error,
				},
			);
			try {
				await cleanupFn();
			} catch (cleanupError) {
				throw new AggregateError(
					[
						failure,
						cleanupError,
					],
					"Test database bootstrap and cleanup failed",
				);
			}
			throw failure;
		}
	});
});
