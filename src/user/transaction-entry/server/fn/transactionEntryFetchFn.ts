import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";
import { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const transactionEntryFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionEntrySchema,
			dataFx: transactionEntryFetchFx({
				...data,
				userId: user.id,
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
