import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { transactionFetchFx } from "~/seller-transaction/fx/transactionFetchFx";
import { transactionGetBuyerInfoFx } from "~/seller-transaction/fx/transactionGetBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/seller-transaction/schema/TransactionBuyerInfoSchema";
import { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionBuyerInfoFn {
	export type Error = Effect.Error<transactionGetBuyerInfoFx>;
}

export const transactionBuyerInfoFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionQuerySchema)
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
			withDateServiceFx(),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
