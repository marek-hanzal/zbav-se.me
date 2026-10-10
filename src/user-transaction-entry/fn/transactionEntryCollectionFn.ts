import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { transactionEntryCollectionFx } from "~/user-transaction-entry/fx/transactionEntryCollectionFx";
import { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";
import { TransactionEntryQuerySchema } from "~/user-transaction-entry/schema/TransactionEntryQuerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionEntryCollectionFn {
	export type Error = Effect.Error<transactionEntryCollectionFx>;
}

export const transactionEntryCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionEntryQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(TransactionEntrySchema),
			dataFx: transactionEntryCollectionFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
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
