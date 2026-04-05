import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

		return zodGuardFx({
			schema: ListingSchema,
			dataFx: listingCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(logger),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
