import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withGalleryItemSelectFx } from "~/user-gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemQuerySchema } from "~/user-gallery-item/schema/GalleryItemQuerySchema";
import type { GalleryItemWhereSchema } from "~/user-gallery-item/schema/GalleryItemWhereSchema";

export namespace galleryItemCollectionFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemWhereSchema.Type;
	}
}

export const galleryItemCollectionFx = Effect.fn("galleryItemCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: galleryItemCollectionFx.Props) {
	const logger = yield* getLoggerFx("galleryItemCollectionFx");
	logger.trace("galleryItemCollectionFx", {
		cursor,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;
