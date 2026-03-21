import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { database } from "~/database/kysely";

export async function migrateTemplateDatabase(templateDatabaseUrl: string) {
	await Effect.gen(function* () {
		const { kysely, migrate } = yield* database;

		yield* Effect.promise(async () => migrate());
		yield* Effect.promise(async () => kysely.destroy());
	}).pipe(
		Effect.provideService(
			DialectContextFx,
			new PostgresDialect({
				pool: new Pool({
					connectionString: templateDatabaseUrl,
				}),
			}),
		),
		Effect.runPromise,
	);
}

const templateDatabaseUrl = process.env.SERVER_DATABASE_URL;

if (!templateDatabaseUrl) {
	throw new Error("SERVER_DATABASE_URL is required");
}

await migrateTemplateDatabase(templateDatabaseUrl);
