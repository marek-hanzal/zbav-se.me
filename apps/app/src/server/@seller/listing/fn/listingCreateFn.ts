import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingCreateFx } from "~/server/@seller/listing/fx/listingCreateFx";
import { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";
import { ListingSchema } from "~/server/@seller/listing/schema/ListingSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingCreateSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: ListingSchema,
			dataFx: listingCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
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
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
