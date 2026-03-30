import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { CountSchema, zodGuardFx } from "@/lib/common/schema";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

export const listingCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
	])
	.inputValidator(ListingCountQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: CountSchema,
			dataFx: listingCountFx({
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
