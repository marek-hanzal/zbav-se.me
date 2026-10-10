import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { GallerySchema } from "~/user-gallery/schema/GallerySchema";
import { transactionEntryGalleryFetchFx } from "~/user-transaction-entry/fx/transactionEntryGalleryFetchFx";
import { TransactionEntryGalleryQuerySchema } from "~/user-transaction-entry/schema/TransactionEntryGalleryQuerySchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace transactionEntryGalleryFetchFn {
	export type Error = Effect.Error<transactionEntryGalleryFetchFx>;
}

export const transactionEntryGalleryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(TransactionEntryGalleryQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);
		return zodGuardFx({
			schema: GallerySchema,
			dataFx: transactionEntryGalleryFetchFx({
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
