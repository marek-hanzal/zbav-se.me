import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { GalleryCountQuerySchema } from "~/user/gallery/server/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";
import { withGallerySelectFx } from "../db/withGallerySelectFx";

export namespace galleryCountFx {
	export interface Props extends GalleryCountQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
	scope,
}: galleryCountFx.Props) {
	const logger = yield* getLoggerFx("galleryCountFx");
	logger.trace("galleryCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withGallerySelectFx({}),
		filter,
		where,
		scope,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
