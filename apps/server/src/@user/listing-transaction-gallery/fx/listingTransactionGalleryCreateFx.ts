import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { listingTransactionPatchFx } from "~/@user/listing-transaction/fx/listingTransactionPatchFx";
import { listingTransactionResolveFx } from "~/@user/listing-transaction/fx/listingTransactionResolveFx";
import { listingTransactionStatusAcceptFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusAcceptFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { listingTransactionGalleryFetchFx } from "./listingTransactionGalleryFetchFx";

export namespace listingTransactionGalleryCreateFx {
	export interface Props {
		listingTransactionId: string;
		uploadIds: string[];
	}
}

export const listingTransactionGalleryCreateFx = ({
	listingTransactionId,
	uploadIds,
}: listingTransactionGalleryCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const transaction = yield* listingTransactionResolveFx({
				listingTransactionId,
				message: "You are not allowed to create a gallery for this listing transaction",
			});

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			if (transaction.side === "seller" && transaction.status === "request") {
				yield* listingTransactionStatusAcceptFx({
					listingTransactionId: transaction.listingTransactionId,
				});
			}

			const gallery = yield* coolGalleryCreateFx();

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
				});
				sort++;
			}

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("listing_transaction_gallery")
					.values({
						id,
						listingTransactionId: transaction.listingTransactionId,
						galleryId: gallery.id,
						side: transaction.side,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* listingTransactionPatchFx({
				listingTransactionId: transaction.listingTransactionId,
			});

			return yield* listingTransactionGalleryFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type listingTransactionGalleryCreateFx = ReturnType<
	typeof listingTransactionGalleryCreateFx
>;
