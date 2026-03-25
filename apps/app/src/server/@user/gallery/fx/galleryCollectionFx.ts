import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/server/@user/gallery/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/server/@user/gallery/db/withGalleryQueryBuilderFx";
import type { GalleryFilterSchema } from "~/server/@user/gallery/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/server/@user/gallery/schema/GalleryQuerySchema";

export namespace galleryCollectionFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCollectionFx = Effect.fn("galleryCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: galleryCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withGalleryCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
