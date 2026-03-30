import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { EntitySchema } from "@/lib/common/schema";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";

export const transactionResolveFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(EntitySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionResolveFx({
				transactionId: data.id,
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
				AccessDeniedErrorFx() {
					throw new Error("AccessDeniedError");
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
