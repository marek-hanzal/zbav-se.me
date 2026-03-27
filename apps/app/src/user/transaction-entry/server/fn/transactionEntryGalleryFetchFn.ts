import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryGalleryFetchFx";
import { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

export const transactionEntryGalleryFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(TransactionEntryGalleryQuerySchema)
	.handler(async ({ data, context: { database, user } }) =>
		zodGuardFx({
			schema: GallerySchema,
			dataFx: transactionEntryGalleryFetchFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		),
	);
