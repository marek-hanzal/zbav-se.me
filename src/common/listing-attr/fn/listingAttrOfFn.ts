import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";
import { listingAttrOfFx } from "../server/fx/listingAttrOfFx";
import { ListingAttrOfSchema } from "../server/schema/ListingAttrOfSchema";

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
			withKyselyFx(database),
			withLoggerFx(rootLogger),
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
