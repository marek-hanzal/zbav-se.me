import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/server/@user/gallery/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/server/@user/gallery/db/withGalleryQueryBuilderFx";
import type { GalleryCountQuerySchema } from "~/server/@user/gallery/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/server/@user/gallery/schema/GalleryFilterSchema";

export namespace galleryCountFx {
	export interface Props extends GalleryCountQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
	scope,
}: galleryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withGalleryCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
