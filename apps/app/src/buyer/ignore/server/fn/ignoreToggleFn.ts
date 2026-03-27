import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { FlagToggleSchema } from "~/buyer/flag/server/schema/FlagToggleSchema";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const ignoreToggleFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(FlagToggleSchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: ListingSchema,
			dataFx: ignoreToggleFx({
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
