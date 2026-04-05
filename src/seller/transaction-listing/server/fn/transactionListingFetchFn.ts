import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";
import { TransactionListingSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const transactionListingFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionListingQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild(name);
		logger.debug(name, data);

		return zodGuardFx({
			schema: TransactionListingSchema,
			dataFx: transactionListingFetchFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(logger),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
