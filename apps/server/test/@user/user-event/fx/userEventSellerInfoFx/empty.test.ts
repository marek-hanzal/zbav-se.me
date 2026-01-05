import { withDatabase } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { beforeEach, describe, it } from "vitest";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import type { Database } from "~/database/Database";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";

describe("userEventSellerInfoFx", () => {
	const db = genId();

	beforeEach(async () => {
		const database = withDatabase<Database>({
			dialect: async () => {
				return new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/postgres`,
						max: 3,
					}),
				});
			},
		});

		const kysely = await database.kysely();

		await sql`CREATE DATABASE ${sql.ref(db)} TEMPLATE test OWNER test`.execute(kysely);

		await kysely.destroy();
	});

	it("runs the effect", async () => {
		const database = withDatabase<Database>({
			dialect: async () => {
				return new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/${db}`,
						max: 3,
					}),
				});
			},
		});
		const kysely = await database.kysely();

		console.log("it", (await sql`select current_database();`.execute(kysely)).rows);

		const result = await Effect.runPromise(
			userEventSellerInfoFx({
				userId: "test-user-id",
			}).pipe(DatabaseContextProvider(kysely)),
		);

		console.log(result);
	});
});
