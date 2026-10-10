import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withUserRestrictionSelectFx } from "~/user-restriction/db/withUserRestrictionSelectFx";

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
			const { select, queryFx } = yield* withUserRestrictionSelectFx({
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

			const query = yield* queryFx(select, {
				userId: user.id,
				isExpired: false,
			});

			const rows = yield* Effect.promise(() => {
				return query.execute();
			});

			return {
				current: rows.findLast((row) => row.isAvailable)?.restriction ?? "none",
				pending: rows.find((row) => !row.isAvailable),
			} as const;
		}).pipe(withKyselyFx(database), withDateServiceFx(), Effect.runPromise);

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
