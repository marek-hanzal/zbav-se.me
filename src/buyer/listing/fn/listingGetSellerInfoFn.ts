import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { EntitySchema } from "@/lib/common/schema";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingGetSellerInfoFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(EntitySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

		return zodGuardFx({
			schema: SellerInfoSchema,
			dataFx: listingGetSellerInfoFx({
				listingId: data.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(logger),
			withCatchFx({
				NotFoundErrorFx(error) {
					logger.error("NotFoundError", {
						message: error.message,
					});
					throw new Error("NotFoundErrorFx");
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
