import { createServerFn } from "@tanstack/react-start";
import { EntitySchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionSuccessFx } from "~/server/@buyer/transaction/fx/transactionSuccessFx";
import { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";
import { withTransactionContextFx } from "~/server/@user/transaction/context/withTransactionContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionSuccessFn = createServerFn({
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
			dataFx: transactionSuccessFx({
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
