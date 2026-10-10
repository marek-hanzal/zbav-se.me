import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { withDatabaseName } from "~/database-query/fn/withDatabaseName";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withDialectFx } from "~/database-query/fx/withDialectFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { genId } from "~/identity/fn/genId";
import { createDatabaseFromTemplate } from "~/test-database/fn/createDatabaseFromTemplate";
import { dropDatabase } from "~/test-database/fn/dropDatabase";
import { waitForDatabaseConnections } from "~/test-database/fn/waitForDatabaseConnections";
import { withAdminDatabase } from "~/test-database/fn/withAdminDatabase";
import { withTemplateLock } from "~/test-database/fn/withTemplateLock";

export namespace testabase {
	export interface Props<in out TDatabase> {
		dsn: string;
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		/**
		 * Root (admin) database name
		 */
		root?: string;
		template?: string;
		name?: string;
		onTestFinished(callbackFn: () => Promise<any>): void;
	}
}

export const testabase = async <const TDatabase>({
	dsn,
	databaseFx,
	root = "postgres",
	template = "test",
	name = genId(),
	onTestFinished,
}: testabase.Props<TDatabase>) => {
	return Effect.gen(function* () {
		const { kysely } = yield* Effect.promise(() =>
			withAdminDatabase({
				databaseFx,
				dsn,
				name,
				root,
			}),
		);

		yield* Effect.promise(async () => {
			try {
				await withTemplateLock({
					kysely,
					template,
					callback: async () => {
						await waitForDatabaseConnections({
							kysely,
							name,
						});
						await sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely);
						await createDatabaseFromTemplate({
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
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseName({
							dsn,
							name: name,
						}),
						application_name: `testabase:db:${name}`,
						max: 1,
					}),
				}),
			),
		);

		onTestFinished(async () => {
			await instance.kysely.destroy();
			await dropDatabase({
				databaseFx,
				dsn,
				name,
				root,
			});
		});

		return instance;
	}).pipe(Effect.runPromise);
};
