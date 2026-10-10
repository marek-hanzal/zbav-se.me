import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { transactionPatchCollectionFx } from "~/seller-transaction/fx/transactionPatchCollectionFx";
import { TransactionPatchCollectionSchema } from "~/seller-transaction/schema/TransactionPatchCollectionSchema";
import { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionPatchCollectionFn {
	export type Error = Effect.Error<transactionPatchCollectionFx>;
}

export const transactionPatchCollectionFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionPatchCollectionSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(TransactionSchema),
			dataFx: transactionPatchCollectionFx({
				...data,
				scope: {
					userId: user.id,
				},
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
