import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemCollectionSelectFx } from "~/@user/gallery-item/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/@user/gallery-item/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemCountQuerySchema } from "~/@user/gallery-item/schema/GalleryItemCountQuerySchema";
import type { GalleryItemFilterSchema } from "~/@user/gallery-item/schema/GalleryItemFilterSchema";

export namespace galleryItemCountFx {
	export interface Props extends GalleryItemCountQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: galleryItemCountFx.Props) {
	return yield* withCountFx({
		selectFx: withGalleryItemCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
