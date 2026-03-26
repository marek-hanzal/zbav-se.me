import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withTransactionContextFx } from "~/server/@user/transaction/context/withTransactionContextFx";
import { transactionEntryCreateFx } from "~/server/@user/transaction-entry/fx/transactionEntryCreateFx";
import { TransactionEntryCreateSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryCreateSchema";
import { TransactionEntrySchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionEntryCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryCreateSchema)
	.handler(async ({ data, context: { database, user } }) => {
		const result = await zodGuardFx({
			schema: TransactionEntrySchema,
			dataFx: transactionEntryCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx({
				expires: 3,
				extend: 1,
			}),
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
		return result as any;
	});
