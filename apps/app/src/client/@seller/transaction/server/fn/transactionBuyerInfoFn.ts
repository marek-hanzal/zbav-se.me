import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionFetchFx } from "~/client/@seller/transaction/server/fx/transactionFetchFx";
import { transactionGetBuyerInfoFx } from "~/client/@seller/transaction/server/fx/transactionGetBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/client/@seller/transaction/server/schema/TransactionBuyerInfoSchema";
import { TransactionQuerySchema } from "~/client/@seller/transaction/server/schema/TransactionQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionBuyerInfoFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return Effect.gen(function* () {
			const transaction = yield* transactionFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
			});

			return yield* zodGuardFx({
				schema: TransactionBuyerInfoSchema,
				dataFx: transactionGetBuyerInfoFx({
					userId: user.id,
					transactionId: transaction.id,
				}),
			});
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
