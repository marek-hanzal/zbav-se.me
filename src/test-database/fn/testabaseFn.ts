import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { createDatabaseFromTemplateFn } from "~/test-database/fn/createDatabaseFromTemplateFn";
import { dropDatabaseFn } from "~/test-database/fn/dropDatabaseFn";
import { waitForDatabaseConnectionsFn } from "~/test-database/fn/waitForDatabaseConnectionsFn";
import { withAdminDatabaseFn } from "~/test-database/fn/withAdminDatabaseFn";
import { withTemplateLockFn } from "~/test-database/fn/withTemplateLockFn";

export namespace testabaseFn {
	export interface Props<in out TDatabase> {
		dsn: string;
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		/**
		 * Root (admin) database name
		 */
		root?: string;
		template?: string;
		name?: string;
		onTestFinishedFn(callbackFn: () => Promise<any>): void;
	}
}

export const testabaseFn = async <const TDatabase>({
	dsn,
	databaseFx,
	root = "postgres",
	template = "test",
	name = genIdFn(),
	onTestFinishedFn,
}: testabaseFn.Props<TDatabase>) => {
	return Effect.gen(function* () {
		const { kysely } = yield* Effect.promise(() =>
			withAdminDatabaseFn({
				databaseFx,
				dsn,
				name,
				root,
			}),
		);

		yield* Effect.promise(async () => {
			try {
				await withTemplateLockFn({
					kysely,
					template,
					callbackFn: async () => {
						await waitForDatabaseConnectionsFn({
							kysely,
							name,
						});
						await sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely);
						await createDatabaseFromTemplateFn({
							kysely,
							name,
							template,
						});
					},
				});
			} finally {
				await kysely.destroy();
			}
		});

		const instance = yield* databaseFx.pipe(
			withDialectFn(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseNameFn({
							dsn,
							name: name,
						}),
						application_name: `testabase:db:${name}`,
						max: 1,
					}),
				}),
			),
		);

		onTestFinishedFn(async () => {
			await instance.kysely.destroy();
			await dropDatabaseFn({
				databaseFx,
				dsn,
				name,
				root,
			});
		});

		return instance;
	}).pipe(Effect.runPromise);
};
