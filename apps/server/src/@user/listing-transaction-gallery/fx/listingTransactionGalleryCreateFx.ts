import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingTransactionPatchFx } from "~/@user/listing-transaction/fx/listingTransactionPatchFx";
import type { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { listingTransactionGalleryFetchFx } from "./listingTransactionGalleryFetchFx";

export namespace listingTransactionGalleryCreateFx {
	export interface Props {
		listingTransactionId: string;
		galleryId: string;
		side: ListingTransactionSideEnumSchema.Type;
	}
}

export const listingTransactionGalleryCreateFx = ({
	listingTransactionId,
	galleryId,
	side,
}: listingTransactionGalleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_gallery")
				.values({
					id,
					listingTransactionId,
					galleryId,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* listingTransactionPatchFx({
			listingTransactionId,
		});

		return yield* listingTransactionGalleryFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingTransactionGalleryCreateFx = ReturnType<
	typeof listingTransactionGalleryCreateFx
>;
