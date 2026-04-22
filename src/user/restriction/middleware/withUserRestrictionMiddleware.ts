import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withUserRestrictionSourceSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionSourceSelectFx";

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
			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();
			const select = yield* withUserRestrictionSourceSelectFx({
				sort: [
					{
						field: "availableAt",
						order: "asc",
					},
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const rows = yield* Effect.promise(() =>
				select
					.where("ur.userId", "=", user.id)
					.where((eb) =>
						eb.or([
							eb("ur.expiresAt", "is", null),
							eb("ur.expiresAt", ">", now),
						]),
					)
					.execute(),
			);

			return {
				current: rows.findLast((row) => row.isAvailable)?.restriction ?? "none",
				pending: rows.find((row) => !row.isAvailable),
			} as const;
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		logger.trace("Resolved user restriction", {
			current: restriction.current,
			pending: restriction.pending,
		});

		return next({
			context: {
				restriction,
			},
		});
	});
