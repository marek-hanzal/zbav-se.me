import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemCollectionSelectFx } from "~/server/@user/gallery-item/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/server/@user/gallery-item/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemCountQuerySchema } from "~/server/@user/gallery-item/schema/GalleryItemCountQuerySchema";
import type { GalleryItemFilterSchema } from "~/server/@user/gallery-item/schema/GalleryItemFilterSchema";

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
