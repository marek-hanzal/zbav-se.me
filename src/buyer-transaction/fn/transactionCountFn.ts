import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { transactionCountFx } from "~/buyer-transaction/fx/transactionCountFx";
import { TransactionCountQuerySchema } from "~/buyer-transaction/schema/TransactionCountQuerySchema";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { CountSchema } from "~/query/schema/CountSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionCountFn {
	export type Error = Effect.Error<transactionCountFx>;
}

export const transactionCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

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
