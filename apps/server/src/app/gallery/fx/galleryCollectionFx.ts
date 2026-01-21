import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/app/gallery/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import type { GalleryFilterSchema } from "~/app/gallery/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";

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
