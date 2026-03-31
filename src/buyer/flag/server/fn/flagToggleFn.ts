import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { FlagToggleSchema } from "~/buyer/flag/server/schema/FlagToggleSchema";
import { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const flagToggleFn = createServerFn({
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
			dataFx: flagToggleFx({
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
