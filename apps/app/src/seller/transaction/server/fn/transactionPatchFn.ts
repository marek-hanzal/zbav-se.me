import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionPatchFx } from "~/seller/transaction/server/fx/transactionPatchFx";
import { TransactionPatchSchema } from "~/seller/transaction/server/schema/TransactionPatchSchema";
import { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";

export const transactionPatchFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionPatchSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionPatchFx({
				...data,
				userId: user.id,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
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
