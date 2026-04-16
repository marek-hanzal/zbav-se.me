import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withGalleryCollectionSelectFx } from "~/user/gallery/server/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/user/gallery/server/db/withGalleryQueryBuilderFx";
import type { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";

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
	limit,
	filter,
	where,
	scope,
	sort,
}: galleryCollectionFx.Props) {
	const logger = yield* getLoggerFx("galleryCollectionFx");
	logger.trace("galleryCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withGalleryCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
