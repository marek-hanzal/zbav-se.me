import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "~/buyer/listing-event/server/schema/ListingEventCreateSchema";
import { ListingEventSchema } from "~/buyer/listing-event/server/schema/ListingEventSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingEventCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingEventCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ListingEventSchema,
			dataFx: listingEventCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				NotFoundErrorFx(error) {
					logger.error("NotFoundError", {
						error,
					});
					throw error;
				},
				ZodErrorFx(error) {
					logger.error("ZodErrorFx", {
						error,
					});
					throw error;
				},
				RuntimeErrorFx(error) {
					logger.error("RuntimeError", {
						message: error.message,
						cause: error.cause,
					});
					throw error;
				},
				InvalidRequestErrorFx(error) {
					logger.error("InvalidRequestError", {
						message: error.message,
					});
					throw error;
				},
				TooManyRequestsFx(error) {
					throw error;
				},
			}),
			Effect.runPromise,
		);
	});
