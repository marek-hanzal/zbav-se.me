import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withGalleryItemCollectionSelectFx } from "~/user/gallery-item/server/db/withGalleryItemCollectionSelectFx";
import { withGalleryItemQueryBuilderFx } from "~/user/gallery-item/server/db/withGalleryItemQueryBuilderFx";
import type { GalleryItemFilterSchema } from "~/user/gallery-item/server/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemQuerySchema";

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
	const logger = yield* getLoggerFx("galleryItemCollectionFx");
	logger.debug("galleryItemCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
	});

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
