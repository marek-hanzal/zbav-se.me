import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { databaseFx } from "~/database/fx/databaseFx";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import { withDialectMiddleware } from "~/request-middleware/middleware/withDialectMiddleware";

export const withDatabaseMiddleware = createMiddleware()
	.middleware([
		withDialectMiddleware,
	])
	.server(async ({ next: nextFn, context: { dialect } }) => {
		return Effect.gen(function* () {
			const database = yield* databaseFx.pipe(withDialectFn(dialect));

			return nextFn({
				context: {
					database,
				},
			});
		}).pipe(Effect.runPromise);
	});
