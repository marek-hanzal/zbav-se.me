import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { favouriteToggleFx } from "~/buyer-listing-favourite/fx/favouriteToggleFx";
import { FavouriteToggleSchema } from "~/buyer-listing-favourite/schema/FavouriteToggleSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace favouriteToggleFn {
	export type Error = Effect.Error<favouriteToggleFx>;
}

export const favouriteToggleFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(FavouriteToggleSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ListingSchema,
			dataFx: favouriteToggleFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withDateServiceFn(),
			withLoggerFn(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
