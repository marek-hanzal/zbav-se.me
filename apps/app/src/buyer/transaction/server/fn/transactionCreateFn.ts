import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";

export const transactionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionCreateSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withCatchFx({
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
