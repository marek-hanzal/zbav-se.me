import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryItemCollectionSelectFx } from "~/app/gallery-item/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemFilterSchema } from "~/app/gallery-item/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";

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
