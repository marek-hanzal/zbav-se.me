import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { CountSchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { TransactionEntryCountQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryCountQuerySchema";

export namespace transactionEntryCountFn {
	export type Error = Effect.Effect.Error<transactionEntryCountFx>;
}

export const transactionEntryCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryCountQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);
		return zodGuardFx({
			schema: CountSchema,
			dataFx: transactionEntryCountFx({
				...data,
				userId: user.id,
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
