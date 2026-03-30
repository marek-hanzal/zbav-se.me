import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withGalleryCollectionSelectFx } from "~/user/gallery/server/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/user/gallery/server/db/withGalleryQueryBuilderFx";
import type { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";

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
