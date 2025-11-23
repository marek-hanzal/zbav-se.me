import { Effect } from "effect";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { listingGalleryCreateFx } from "~/@user/listing-gallery/fx/listingGalleryCreateFx";

export namespace galleryCreateFx {
	export interface Props {
		listingId: string;
		uploadIds: string[];
	}
}

export const galleryCreateFx = ({ listingId, uploadIds }: galleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const gallery = yield* coolGalleryCreateFx();

		yield* galleryItemCreateFx({
			galleryId: gallery.id,
			uploadIds,
		});

		yield* listingGalleryCreateFx({
			listingId,
			galleryId: gallery.id,
		});

		return gallery.id;
	});
};

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
