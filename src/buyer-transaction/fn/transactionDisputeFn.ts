import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { transactionDisputeFx } from "~/buyer-transaction/fx/transactionDisputeFx";
import { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { EntitySchema } from "~/entity/schema/EntitySchema";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withTransactionContextFx } from "~/user-transaction/context/withTransactionContextFx";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionDisputeFn {
	export type Error = Effect.Error<transactionDisputeFx>;
}

export const transactionDisputeFn = createServerFn({
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
			dataFx: transactionDisputeFx({
				transactionId: data.id,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
			withTransactionContextFx(),
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
