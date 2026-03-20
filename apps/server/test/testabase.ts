import { DialectContextFx, MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import type { Database } from "~/database/Database";
import { database } from "~/database/kysely";

export const testabase = async (id: string = genId()) => {
	const db = id;

	return Effect.gen(function* () {
		const { kysely } = yield* database.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/postgres`,
						max: 1,
					}),
				}),
			),
		);

		// Drop database if it already exists to prevent conflicts
		yield* Effect.promise(async () =>
			sql`DROP DATABASE IF EXISTS ${sql.ref(db)}`.execute(kysely),
		);

		yield* Effect.promise(async () =>
			sql`CREATE DATABASE ${sql.ref(db)} TEMPLATE test OWNER test`.execute(kysely),
		);

		yield* Effect.promise(async () => kysely.destroy());

		return yield* withDatabaseFx<Database>({
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
							connectionString: `${process.env.SERVER_DATABASE_URL}/${db}`,
							max: 1,
						}),
					}),
				),
			);
	}).pipe(Effect.runPromise);
};
