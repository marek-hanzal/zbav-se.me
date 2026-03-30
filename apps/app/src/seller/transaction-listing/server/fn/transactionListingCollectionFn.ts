import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/schema";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";
import { TransactionListingSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionListingCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionListingQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: z.array(TransactionListingSchema),
			dataFx: transactionListingCollectionFx({
				...data,
				scope: {
					userId: user.id,
				},
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
