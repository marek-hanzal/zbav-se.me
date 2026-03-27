import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@buyer/listing-event/server/fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "~/@buyer/listing-event/server/schema/ListingEventCreateSchema";
import { ListingEventSchema } from "~/@buyer/listing-event/server/schema/ListingEventSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { noticeError } from "~/server/notice/noticeError";

export const listingEventCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingEventCreateSchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: ListingEventSchema,
			dataFx: listingEventCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodErrorFx");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestErrorFx");
				},
				TooManyRequestsFx() {
					throw noticeError({
						message: "Wait little bit, bro",
					});
				},
			}),
			Effect.runPromise,
		),
	);
