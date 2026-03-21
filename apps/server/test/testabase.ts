import { DialectContextFx, MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { clonePostgresTemplateDatabase } from "@zbav-se.me/test/postgres";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "~/database/Database";

const DATABASE_BASE_URL = "postgresql://test:test@127.0.0.1:55432";

export const testabase = async (id: string = genId()) => {
	const clonedDatabase = await clonePostgresTemplateDatabase({
		baseUrl: DATABASE_BASE_URL,
		databaseName: id,
		templateDatabaseName: "test",
		user: "test",
	});

	return withDatabaseFx<Database>({
		async onPreMigration() {
			//
		},
	})
		.pipe(Effect.provideService(MigrationContextFx, {}))
		.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: clonedDatabase.databaseUrl,
						max: 1,
					}),
				}),
			),
		)
		.pipe(Effect.runPromise);
};
