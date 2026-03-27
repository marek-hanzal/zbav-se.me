import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { transactionPatchCollectionFx } from "~/@seller/transaction/server/fx/transactionPatchCollectionFx";
import { TransactionPatchCollectionSchema } from "~/@seller/transaction/server/schema/TransactionPatchCollectionSchema";
import { TransactionSchema } from "~/@seller/transaction/server/schema/TransactionSchema";
import { withTransactionContextFx } from "~/@user/transaction/server/context/withTransactionContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionPatchCollectionFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionPatchCollectionSchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: z.array(TransactionSchema),
			dataFx: transactionPatchCollectionFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
			}),
			Effect.runPromise,
		);
	});
