import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/server/@buyer/listing-event/fx/listingEventCreateFx";
import { ListingEventCreateSchema } from "~/server/@buyer/listing-event/schema/ListingEventCreateSchema";
import { ListingEventSchema } from "~/server/@buyer/listing-event/schema/ListingEventSchema";
import { noticeError } from "~/server/@common/notice/noticeError";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

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
