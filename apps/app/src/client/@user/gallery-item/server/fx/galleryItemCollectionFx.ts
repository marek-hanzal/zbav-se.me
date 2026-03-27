import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryItemCollectionSelectFx } from "~/client/@user/gallery-item/server/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/client/@user/gallery-item/server/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemFilterSchema } from "~/client/@user/gallery-item/server/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/client/@user/gallery-item/server/schema/GalleryItemQuerySchema";

export namespace galleryItemCollectionFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemCollectionFx = Effect.fn("galleryItemCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: galleryItemCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withGalleryItemCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;
