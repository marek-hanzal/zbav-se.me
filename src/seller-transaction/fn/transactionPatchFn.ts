import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { transactionPatchFx } from "~/seller-transaction/fx/transactionPatchFx";
import { TransactionPatchSchema } from "~/seller-transaction/schema/TransactionPatchSchema";
import { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withTransactionContextFx } from "~/user-transaction/context/withTransactionContextFx";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionPatchFn {
	export type Error = Effect.Error<transactionPatchFx>;
}

export const transactionPatchFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionPatchSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionPatchFx({
				...data,
				userId: user.id,
				scope: {
					userId: user.id,
				},
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
