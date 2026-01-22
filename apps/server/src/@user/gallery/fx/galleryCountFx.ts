import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/@user/gallery/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/@user/gallery/db/withGalleryQueryBuilderFx";
import type { GalleryCountQuerySchema } from "~/@user/gallery/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/@user/gallery/schema/GalleryFilterSchema";

export namespace galleryCountFx {
	export interface Props extends GalleryCountQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: galleryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withGalleryCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
