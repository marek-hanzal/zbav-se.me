import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { transactionGetBuyerInfoFx } from "~/seller/transaction/server/fx/transactionGetBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/seller/transaction/server/schema/TransactionBuyerInfoSchema";
import { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionBuyerInfoFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return Effect.gen(function* () {
			const transaction = yield* transactionFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
			});

			return yield* zodGuardFx({
				schema: TransactionBuyerInfoSchema,
				dataFx: transactionGetBuyerInfoFx({
					userId: user.id,
					transactionId: transaction.id,
				}),
			});
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLoggerFx(rootLogger),
			withCatchFx({
				NotFoundErrorFx(error) {
					logger.error("NotFoundError", {
						message: error.message,
					});
					throw new Error("NotFoundError");
				},
				RuntimeErrorFx(error) {
					logger.error("RuntimeError", {
						message: error.message,
						cause: error.cause,
					});
					throw new Error("RuntimeError");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
