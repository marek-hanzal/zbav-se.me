import { randomUUID } from "node:crypto";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { createDatabaseFromTemplateFn } from "~/test-database/fn/createDatabaseFromTemplateFn";
import { dropDatabaseFn } from "~/test-database/fn/dropDatabaseFn";
import { withAdminDatabaseFn } from "~/test-database/fn/withAdminDatabaseFn";
import { withTemplateLockFn } from "~/test-database/fn/withTemplateLockFn";

export namespace testabaseFn {
	export interface Props<in out TDatabase> {
		dsn: string;
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		root?: string;
		template?: string;
		/** Human-readable label. Each allocation always gets a unique database name. */
		name?: string;
		onTestFinishedFn(callbackFn: () => Promise<void>): void;
	}
}

export const testabaseFn = async <const TDatabase>({
	dsn,
	databaseFx,
	root = "postgres",
	template = "test",
	name = "test",
	onTestFinishedFn,
}: testabaseFn.Props<TDatabase>) => {
	withDatabaseNameFn({
		dsn,
		name,
	});
	const databaseName = `${name.slice(0, 30)}_${randomUUID().replaceAll("-", "")}`;
	const connectionString = withDatabaseNameFn({
		dsn,
		name: databaseName,
	});
	const admin = withAdminDatabaseFn({
		dsn,
		root,
		name: databaseName,
	});
	let created = false;
	let pool: Pool | undefined;
	let instance: withDatabaseFx.Instance<TDatabase> | undefined;
	let cleanup: Promise<void> | undefined;
	const cleanupFn = () =>
		(cleanup ??= (async () => {
			const errors: unknown[] = [];
			try {
				if (instance) await instance.kysely.destroy();
				else if (pool) await pool.end();
			} catch (error) {
				errors.push(error);
			}
			try {
				if (created)
					await dropDatabaseFn({
						kysely: admin,
						name: databaseName,
					});
			} catch (error) {
				errors.push(error);
			} finally {
				try {
					await admin.destroy();
				} catch (error) {
					errors.push(error);
				}
			}
			if (errors.length)
				throw new AggregateError(errors, `Test database cleanup failed: ${databaseName}`);
		})());

	try {
		await withTemplateLockFn({
			kysely: admin,
			template,
			callbackFn: async () => {
				await createDatabaseFromTemplateFn({
					kysely: admin,
					name: databaseName,
					template,
				});
				created = true;
			},
		});
		pool = new Pool({
			connectionString,
			application_name: `testabase:db:${databaseName}`,
			max: 1,
			connectionTimeoutMillis: 5_000,
		});
		instance = await databaseFx.pipe(
			withDialectFn(
				new PostgresDialect({
					pool,
				}),
			),
			Effect.runPromise,
		);
		onTestFinishedFn(cleanupFn);
		return {
			...instance,
			databaseName,
			cleanupFn,
		};
	} catch (error) {
		try {
			await cleanupFn();
		} catch (cleanupError) {
			throw new AggregateError(
				[
					error,
					cleanupError,
				],
				`Test database allocation failed: ${databaseName}`,
			);
		}
		throw error;
	}
};
