import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { EntitySchema } from "@/lib/common/schema";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const listingGetSellerInfoFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(EntitySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: SellerInfoSchema,
			dataFx: listingGetSellerInfoFx({
				listingId: data.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundErrorFx");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeErrorFx");
				},
				ZodErrorFx() {
					throw new Error("ZodErrorFx");
				},
			}),
			Effect.runPromise,
		);
	});
