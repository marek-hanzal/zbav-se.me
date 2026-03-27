import { createServerFn } from "@tanstack/react-start";
import { CountSchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionCountFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionCountQuerySchema)
	.handler(async ({ data, context: { database, user } }) => {
		return zodGuardFx({
			schema: CountSchema,
			dataFx: transactionCountFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
