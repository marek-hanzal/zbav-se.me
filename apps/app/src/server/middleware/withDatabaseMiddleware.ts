import { createMiddleware } from "@tanstack/react-start";
import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { databaseFx } from "~/server/database/databaseFx";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";

export const withDatabaseMiddleware = createMiddleware().server(async ({ next }) =>
	Effect.gen(function* () {
		const databaseConfig = ServerDatabaseSchema.parse(process.env);

		console.log("\n\n\t\t\t ======= PG POOL =======\n\n");

		const database = yield* databaseFx.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: databaseConfig.SERVER_DATABASE_URL,
						max: 3,
					}),
				}),
			),
		);

		return next({
			context: {
				database,
			},
		});
	}).pipe(Effect.runPromise),
);
