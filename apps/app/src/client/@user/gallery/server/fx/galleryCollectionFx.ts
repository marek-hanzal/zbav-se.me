import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/client/@user/gallery/server/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/client/@user/gallery/server/db/withGalleryQueryBuilderFx";
import type { GalleryFilterSchema } from "~/client/@user/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/client/@user/gallery/server/schema/GalleryQuerySchema";

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
