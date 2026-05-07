import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { GalleryItemCountQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemCountQuerySchema";
import type { GalleryItemFilterSchema } from "~/user/gallery-item/server/schema/GalleryItemFilterSchema";
import { withGalleryItemSelectFx } from "../db/withGalleryItemSelectFx";

export namespace galleryItemCountFx {
	export interface Props extends GalleryItemCountQuerySchema.Type {
		scope: GalleryItemFilterSchema.Type;
	}
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	filter,
	where,
	scope,
}: galleryItemCountFx.Props) {
	const logger = yield* getLoggerFx("galleryItemCountFx");
	logger.trace("galleryItemCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withGalleryItemSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
