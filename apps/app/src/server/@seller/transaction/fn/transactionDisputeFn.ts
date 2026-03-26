import { createServerFn } from "@tanstack/react-start";
import { EntitySchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionDisputeFx } from "~/server/@seller/transaction/fx/transactionDisputeFx";
import { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
import { withTransactionContextFx } from "~/server/@user/transaction/context/withTransactionContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionDisputeFn = createServerFn({
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
			dataFx: transactionDisputeFx({
				transactionId: data.transactionId,
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
