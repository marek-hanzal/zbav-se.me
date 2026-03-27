import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/client/@user/gallery-item/server/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/client/@user/gallery-item/server/db/withGalleryItemSelectFx";
import type { GalleryItemFilterSchema } from "~/client/@user/gallery-item/server/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/client/@user/gallery-item/server/schema/GalleryItemQuerySchema";

export namespace galleryItemFetchFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemFetchFx = Effect.fn("galleryItemFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: galleryItemFetchFx.Props) {
	return yield* withFetchFx({
		resource: "gallery-item",
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
