import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryGalleryFetchFx";
import { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

export namespace transactionEntryGalleryFetchFn {
	export type Error = Effect.Effect.Error<transactionEntryGalleryFetchFx>;
}

export const transactionEntryGalleryFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryGalleryQuerySchema)
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
