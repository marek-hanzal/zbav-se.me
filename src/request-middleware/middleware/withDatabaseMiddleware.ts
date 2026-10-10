import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { databaseFx } from "~/database/fx/databaseFx";
import { withDialectFx } from "~/database-query/fx/withDialectFx";
import { withDialectMiddleware } from "~/request-middleware/middleware/withDialectMiddleware";

export const withDatabaseMiddleware = createMiddleware()
	.middleware([
		withDialectMiddleware,
	])
	.server(async ({ next, context: { dialect } }) => {
		return Effect.gen(function* () {
			const database = yield* databaseFx.pipe(withDialectFx(dialect));

			return next({
				context: {
					database,
				},
			});
		}).pipe(Effect.runPromise);
	});
