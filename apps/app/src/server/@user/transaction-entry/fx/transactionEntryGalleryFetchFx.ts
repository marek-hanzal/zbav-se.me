import { NotFoundErrorFx } from "@use-pico/common/error";
import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/server/@user/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/server/@user/gallery/db/withGallerySelectFx";
import { transactionEntryFetchFx } from "~/server/@user/transaction-entry/fx/transactionEntryFetchFx";
import type { TransactionEntryGalleryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryGalleryQuerySchema";

export namespace transactionEntryGalleryFetchFx {
	export interface Props extends TransactionEntryGalleryQuerySchema.Type {
		userId: string;
	}
}

export const transactionEntryGalleryFetchFx = Effect.fn("transactionEntryGalleryFetchFx")(
	function* ({ userId, where }: transactionEntryGalleryFetchFx.Props) {
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
			queryFx: withGalleryQueryBuilderFx,
		});
	},
);

export type transactionEntryGalleryFetchFx = ReturnType<typeof transactionEntryGalleryFetchFx>;
