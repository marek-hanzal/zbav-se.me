import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { listingCreateFx } from "~/seller-listing/fx/listingCreateFx";
import { ListingCreateSchema } from "~/seller-listing/schema/ListingCreateSchema";
import { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import { withUploadConfigFx } from "~/user-upload/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user-upload/schema/withUploadConfigEnv";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace listingCreateFn {
	export type Error = Effect.Error<listingCreateFx>;
}

export const listingCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ListingCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ListingSchema,
			dataFx: listingCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
			withUploadConfigFx(withUploadConfigEnv()),
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
