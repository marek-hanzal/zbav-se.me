import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { ListingSchema } from "~/client/@buyer/listing/server/schema/ListingSchema";
import { thumbCreateFx } from "~/client/@buyer/thumb/server/fx/thumbCreateFx";
import { ThumbCreateSchema } from "~/client/@buyer/thumb/server/schema/ThumbCreateSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const thumbCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ThumbCreateSchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: ListingSchema,
			dataFx: thumbCreateFx({
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
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestErrorFx");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodErrorFx");
				},
			}),
			Effect.runPromise,
		),
	);
