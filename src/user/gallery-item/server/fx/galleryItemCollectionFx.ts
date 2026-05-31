import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { GalleryItemQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemQuerySchema";
import { withGalleryItemSelectFx } from "../db/withGalleryItemSelectFx";
import type { GalleryItemWhereSchema } from "../schema/GalleryItemWhereSchema";

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
