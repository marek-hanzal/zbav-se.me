import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withGalleryItemSelectFx } from "~/user/gallery-item/server/db/withGalleryItemSelectFx";
import type { GalleryItemQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemQuerySchema";
import type { GalleryItemWhereSchema } from "../schema/GalleryItemWhereSchema";

export namespace galleryItemFetchFx {
	export interface Props extends GalleryItemQuerySchema.Type {
		scope: GalleryItemWhereSchema.Type;
	}
}

export const galleryItemFetchFx = Effect.fn("galleryItemFetchFx")(function* ({
	where,
	scope,
	sort,
}: galleryItemFetchFx.Props) {
	const logger = yield* getLoggerFx("galleryItemFetchFx");
	logger.trace("galleryItemFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "gallery-item",
		selectFx: withGalleryItemSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
