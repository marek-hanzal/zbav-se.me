import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { GalleryCountQuerySchema } from "~/user/gallery/server/schema/GalleryCountQuerySchema";
import { withGallerySelectFx } from "../db/withGallerySelectFx";
import type { GalleryWhereSchema } from "../schema/GalleryWhereSchema";

export namespace galleryCountFx {
	export interface Props extends GalleryCountQuerySchema.Type {
		scope: GalleryWhereSchema.Type;
	}
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	where,
	scope,
}: galleryCountFx.Props) {
	const logger = yield* getLoggerFx("galleryCountFx");
	logger.trace("galleryCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withGallerySelectFx({}),
		where,
		scope,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
