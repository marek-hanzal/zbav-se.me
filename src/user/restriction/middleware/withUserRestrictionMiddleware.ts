import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withUserRestrictionMiddleware {
	export interface Context {
		restriction: RestrictionEnumSchema.Type;
	}
}

export const withUserRestrictionMiddleware = createMiddleware()
	.middleware([
		withUserMiddleware,
		withDatabaseMiddleware,
	])
	.server(async ({ next, context: { database, user, rootLogger } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withUserRestrictionMiddleware",
		]);

		const restriction = await Effect.gen(function* () {
			const select = yield* withActiveUserRestrictionSelectFx({
				userId: user.id,
			});
			const row = yield* Effect.promise(() => select.executeTakeFirst());

			return row?.restriction ?? "none";
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		logger.trace("Resolved user restriction", {
			restriction,
		});

		return next({
			context: {
				restriction,
			},
		});
	});
