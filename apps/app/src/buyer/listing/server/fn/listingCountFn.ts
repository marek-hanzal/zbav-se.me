import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { CountSchema, zodGuardFx } from "@/lib/common/schema";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ListingCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: CountSchema,
			dataFx: listingCountFx({
				...data,
				userId: user.id,
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
		),
	);
