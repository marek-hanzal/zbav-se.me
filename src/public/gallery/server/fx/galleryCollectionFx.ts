import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withGallerySelectFx } from "~/public/gallery/server/db/withGallerySelectFx";
import type { GalleryFilterSchema } from "~/public/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/public/gallery/server/schema/GalleryQuerySchema";

export namespace galleryCollectionFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCollectionFx = Effect.fn("galleryCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: galleryCollectionFx.Props) {
	const logger = yield* getLoggerFx("galleryCollectionFx");
	logger.trace("galleryCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withGallerySelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
