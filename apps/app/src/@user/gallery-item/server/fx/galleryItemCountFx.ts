import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemCollectionSelectFx } from "~/@user/gallery-item/server/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/@user/gallery-item/server/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemCountQuerySchema } from "~/@user/gallery-item/server/schema/GalleryItemCountQuerySchema";
import type { GalleryItemFilterSchema } from "~/@user/gallery-item/server/schema/GalleryItemFilterSchema";

export namespace galleryItemCountFx {
	export interface Props extends GalleryItemCountQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	filter,
	where,
	scope,
}: galleryItemCountFx.Props) {
	return yield* withCountFx({
		selectFx: withGalleryItemCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
