import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { listingTransactionGalleryFetchFx } from "./listingTransactionGalleryFetchFx";

export namespace listingTransactionGalleryCreateFx {
	export interface Props {
		listingTransactionId: string;
		galleryId: string;
		side: ListingTransactionSideSchema.Type;
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
					event: "gallery",
					galleryId,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
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
