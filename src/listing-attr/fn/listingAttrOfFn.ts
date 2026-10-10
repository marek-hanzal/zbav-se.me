import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { listingAttrOfFx } from "~/listing-attr/fx/listingAttrOfFx";
import { ListingAttrOfSchema } from "~/listing-attr/schema/ListingAttrOfSchema";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace listingAttrOfFn {
	export type Error = Effect.Error<listingAttrOfFx>;
}

export const listingAttrOfFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(
		z
			.looseObject({
				listingId: z.string().min(1),
				categoryId: z.string().min(1),
				nonEmpty: z.boolean().optional(),
			})
			.strip(),
	)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(ListingAttrOfSchema),
			dataFx: listingAttrOfFx(data),
		}).pipe(
			withKyselyFn(database),
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
