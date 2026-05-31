import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import {
	type DialectContextFx,
	type withDatabaseFx,
	withDatabaseName,
	withDialectFx,
} from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { createDatabaseFromTemplate } from "./createDatabaseFromTemplate";
import { dropDatabase } from "./dropDatabase";
import { waitForDatabaseConnections } from "./waitForDatabaseConnections";
import { withAdminDatabase } from "./withAdminDatabase";
import { withTemplateLock } from "./withTemplateLock";

export namespace testabase {
	export interface Props<in out TDatabase> {
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
	databaseFx,
	root = "postgres",
	template = "test",
	name = genId(),
	onTestFinished,
}: testabase.Props<TDatabase>) => {
	return Effect.gen(function* () {
		const databaseConfig = ServerDatabaseSchema.parse(process.env);

		const { kysely } = yield* Effect.promise(() =>
			withAdminDatabase({
				databaseFx,
				dsn: databaseConfig.SERVER_DATABASE_URL,
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
							dsn: databaseConfig.SERVER_DATABASE_URL,
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
				dsn: databaseConfig.SERVER_DATABASE_URL,
				name,
				root,
			});
		});

		return instance;
	}).pipe(Effect.runPromise);
};
