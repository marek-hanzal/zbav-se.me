import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";
import type { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

export namespace transactionEntryGalleryFetchFx {
	export interface Props extends TransactionEntryGalleryQuerySchema.Type {
		userId: string;
	}
}

export const transactionEntryGalleryFetchFx = Effect.fn("transactionEntryGalleryFetchFx")(
	function* ({ userId, where }: transactionEntryGalleryFetchFx.Props) {
		const logger = yield* getLoggerFx("transactionEntryGalleryFetchFx", "transaction-entry");
		logger.trace("transactionEntryGalleryFetchFx", {
			userId,
			where,
		});

		const transactionEntry = yield* transactionEntryFetchFx({
			userId,
			where: {
				id: where.transactionEntryId,
			},
		});

		if (transactionEntry.kind !== "gallery") {
			return yield* new NotFoundErrorFx({
				resource: "gallery",
				resourceId: where.transactionEntryId,
				message: "Gallery not found",
			});
		}

		return yield* withFetchFx({
			resource: "gallery",
			selectFx: withGallerySelectFx({}),
			where: {
				id: transactionEntry.payload.galleryId,
			},
		});
	},
);

export type transactionEntryGalleryFetchFx = ReturnType<typeof transactionEntryGalleryFetchFx>;
