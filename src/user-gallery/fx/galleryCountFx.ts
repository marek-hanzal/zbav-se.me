import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withGallerySelectFx } from "~/user-gallery/db/withGallerySelectFx";
import type { GalleryCountQuerySchema } from "~/user-gallery/schema/GalleryCountQuerySchema";
import type { GalleryWhereSchema } from "~/user-gallery/schema/GalleryWhereSchema";

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
