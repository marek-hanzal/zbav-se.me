import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryCollectionSelectFx } from "~/app/gallery/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import type { GalleryCountQuerySchema } from "~/app/gallery/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/app/gallery/schema/GalleryFilterSchema";

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
