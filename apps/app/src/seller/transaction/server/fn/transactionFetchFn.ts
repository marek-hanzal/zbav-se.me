import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
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
