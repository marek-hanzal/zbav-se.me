import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withGalleryItemSelectFx } from "~/user-gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemCountQuerySchema } from "~/user-gallery-item/schema/GalleryItemCountQuerySchema";
import type { GalleryItemWhereSchema } from "~/user-gallery-item/schema/GalleryItemWhereSchema";

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
