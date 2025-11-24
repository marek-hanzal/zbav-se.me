import { Effect } from "effect";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { listingGalleryCreateFx } from "~/@user/listing-gallery/fx/listingGalleryCreateFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace galleryCreateFx {
	export interface Props {
		listingId: string;
		uploadIds: string[];
	}
}

export const galleryCreateFx = ({ listingId, uploadIds }: galleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const gallery = yield* coolGalleryCreateFx();

		if (uploadIds.length === 0) {
			return yield* new InvalidRequestError({
				message: "At least one upload is required",
			});
		}

		let sort = 0;
		for (const uploadId of uploadIds) {
			yield* galleryItemCreateFx({
				galleryId: gallery.id,
				uploadId,
				sort,
			});
			sort++;
		}

		yield* listingGalleryCreateFx({
			listingId,
			galleryId: gallery.id,
		});

		return gallery.id;
	});
};

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
