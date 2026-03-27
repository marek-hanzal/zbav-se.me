import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/client/@user/gallery/server/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/client/@user/gallery/server/db/withGallerySelectFx";
import type { GalleryFilterSchema } from "~/client/@user/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/client/@user/gallery/server/schema/GalleryQuerySchema";

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
