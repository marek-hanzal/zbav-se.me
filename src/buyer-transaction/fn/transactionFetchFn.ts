import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { transactionFetchFx } from "~/buyer-transaction/fx/transactionFetchFx";
import { TransactionQuerySchema } from "~/buyer-transaction/schema/TransactionQuerySchema";
import { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionFetchFn {
	export type Error = Effect.Error<transactionFetchFx>;
}

export const transactionFetchFn = createServerFn()
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

		return zodGuardFx({
			schema: TransactionSchema,
			dataFx: transactionFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
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
