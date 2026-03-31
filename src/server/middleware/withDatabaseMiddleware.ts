import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDialectFx } from "@/lib/common/database";
import { databaseFx } from "~/server/database/databaseFx";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";

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
