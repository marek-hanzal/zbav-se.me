import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { transactionEntryCollectionFx } from "~/server/@user/transaction-entry/fx/transactionEntryCollectionFx";
import { TransactionEntryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryQuerySchema";
import { TransactionEntrySchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionEntryCollectionFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		const result = await zodGuardFx({
			schema: z.array(TransactionEntrySchema),
			dataFx: transactionEntryCollectionFx({
				...data,
				userId: user.id,
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
		return result as any;
	});
