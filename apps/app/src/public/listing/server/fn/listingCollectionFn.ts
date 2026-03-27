import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";
import { ListingSchema } from "~/public/listing/server/schema/ListingSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

export const listingCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
	])
	.inputValidator(ListingQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: z.array(ListingSchema),
			dataFx: listingCollectionFx({
				...data,
				scope: {},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
