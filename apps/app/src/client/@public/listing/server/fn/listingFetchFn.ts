import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { listingFetchFx } from "~/client/@public/listing/server/fx/listingFetchFx";
import { ListingQuerySchema } from "~/client/@public/listing/server/schema/ListingQuerySchema";
import { ListingSchema } from "~/client/@public/listing/server/schema/ListingSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

export const listingFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
	])
	.inputValidator(ListingQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: ListingSchema,
			dataFx: listingFetchFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
