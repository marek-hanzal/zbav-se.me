import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingGalleryCreateFx {
	export interface Props {
		listingId: string;
		galleryId: string;
	}
}

export const listingGalleryCreateFx = ({ listingId, galleryId }: listingGalleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_gallery")
				.values({
					id,
					listingId,
					galleryId,
					createdAt: new Date(),
				})
				.execute();
		});

		return id;
	});
};

export type listingGalleryCreateFx = ReturnType<typeof listingGalleryCreateFx>;
