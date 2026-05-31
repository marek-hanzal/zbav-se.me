import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withGallerySelectFx } from "~/public/gallery/server/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/public/gallery/server/schema/GalleryQuerySchema";
import type { GalleryWhereSchema } from "../schema/GalleryWhereSchema";

export namespace galleryCollectionFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryWhereSchema.Type;
	}
}

export const galleryCollectionFx = Effect.fn("galleryCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: galleryCollectionFx.Props) {
	const logger = yield* getLoggerFx("galleryCollectionFx");
	logger.trace("galleryCollectionFx", {
		cursor,
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
		where,
		scope,
		limit,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
