import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { GalleryItemCountQuerySchema } from "~/user/gallery-item/server/schema/GalleryItemCountQuerySchema";
import { withGalleryItemSelectFx } from "../db/withGalleryItemSelectFx";
import type { GalleryItemWhereSchema } from "../schema/GalleryItemWhereSchema";

export namespace galleryItemCountFx {
	export interface Props extends GalleryItemCountQuerySchema.Type {
		scope: GalleryItemWhereSchema.Type;
	}
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	where,
	scope,
}: galleryItemCountFx.Props) {
	const logger = yield* getLoggerFx("galleryItemCountFx");
	logger.trace("galleryItemCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withGalleryItemSelectFx({}),
		where,
		scope,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
