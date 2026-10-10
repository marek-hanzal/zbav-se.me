import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { TransactionCreateSchema } from "~/buyer-transaction/schema/TransactionCreateSchema";
import { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionCreateFn {
	export type Error = Effect.Error<transactionCreateFx>;
}

export const transactionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionCreateSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionCreateFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withDateServiceFn(),
			withTransactionContextFn(),
			withLoggerFn(rootLogger),
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
