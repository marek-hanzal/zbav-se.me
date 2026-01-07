import { DialectContextProvider } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { database } from "~/database/kysely";

export const testabase = async (id: string = genId()) => {
	const db = id;

	return Effect.gen(function* () {
		const { kysely } = yield* database.pipe(
			DialectContextProvider(
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/postgres`,
						max: 3,
					}),
				}),
			),
		);

		yield* Effect.promise(async () =>
			sql`CREATE DATABASE ${sql.ref(db)} TEMPLATE test OWNER test`.execute(kysely),
		);

		yield* Effect.promise(async () => kysely.destroy());

		return yield* database.pipe(
			DialectContextProvider(
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/${db}`,
						max: 3,
					}),
				}),
			),
		);
	}).pipe(Effect.runPromise);
};
