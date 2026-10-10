import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { CountSchema } from "~/query/schema/CountSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { listingCountFx } from "~/seller-listing/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/seller-listing/schema/ListingCountQuerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace listingCountFn {
	export type Error = Effect.Error<listingCountFx>;
}

export const listingCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ListingCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: CountSchema,
			dataFx: listingCountFx({
				...data,
				userId: user.id,
				scope: {
					userId: user.id,
				},
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
