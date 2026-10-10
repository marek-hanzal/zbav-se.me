import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { transactionRejectFx } from "~/buyer-transaction/fx/transactionRejectFx";
import { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { EntitySchema } from "~/entity/schema/EntitySchema";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionRejectFn {
	export type Error = Effect.Error<transactionRejectFx>;
}

export const transactionRejectFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(EntitySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionRejectFx({
				transactionId: data.id,
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
