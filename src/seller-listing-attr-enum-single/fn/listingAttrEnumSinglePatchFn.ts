import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { listingAttrEnumSinglePatchFx } from "~/seller-listing-attr-enum-single/fx/listingAttrEnumSinglePatchFx";
import { ListingAttrEnumSinglePatchSchema } from "~/seller-listing-attr-enum-single/schema/ListingAttrEnumSinglePatchSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace listingAttrEnumSinglePatchFn {
	export type Error = Effect.Error<listingAttrEnumSinglePatchFx>;
}

export const listingAttrEnumSinglePatchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ListingAttrEnumSinglePatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.any(),
			dataFx: listingAttrEnumSinglePatchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withLoggerFn(rootLogger),
			withDateServiceFn(),
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
