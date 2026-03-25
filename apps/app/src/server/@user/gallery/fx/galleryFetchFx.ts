import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/server/@user/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/server/@user/gallery/db/withGallerySelectFx";
import type { GalleryFilterSchema } from "~/server/@user/gallery/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/server/@user/gallery/schema/GalleryQuerySchema";

export namespace galleryFetchFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryFetchFx = Effect.fn("galleryFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: galleryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "gallery",
		selectFx: withGallerySelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
