import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const transactionEntryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryCreateSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionEntrySchema,
			dataFx: transactionEntryCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withCatchFx({
				AccessDeniedErrorFx() {
					throw new Error("AccessDeniedError");
				},
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				InvalidRequestErrorFx() {
					throw new Error("InvalidRequestError");
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
