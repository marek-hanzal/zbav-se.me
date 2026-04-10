import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { ThumbCreateSchema } from "~/buyer/thumb/server/schema/ThumbCreateSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const thumbCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ThumbCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.debug(name, data);
		return zodGuardFx({
			schema: ListingSchema,
			dataFx: thumbCreateFx({
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
						message: error.message,
					});
					throw new Error("NotFoundErrorFx");
				},
				InvalidRequestErrorFx(error) {
					logger.error("InvalidRequestError", {
						message: error.message,
					});
					throw new Error("InvalidRequestErrorFx");
				},
				RuntimeErrorFx(error) {
					logger.error("RuntimeError", {
						message: error.message,
						cause: error.cause,
					});
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodErrorFx", {
						zod,
						input,
					});
					throw new Error("ZodErrorFx");
				},
			}),
			Effect.runPromise,
		);
	});
