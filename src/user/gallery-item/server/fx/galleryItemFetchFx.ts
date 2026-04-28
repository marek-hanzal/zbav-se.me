import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withGalleryItemSelectFx } from "~/user/gallery-item/server/db/withGalleryItemSelectFx";
import type { GalleryItemFilterSchema } from "~/user/gallery-item/server/schema/GalleryItemFilterSchema";
import type { GalleryItemQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemQuerySchema";

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
	const logger = yield* getLoggerFx("galleryItemFetchFx");
	logger.trace("galleryItemFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "gallery-item",
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
