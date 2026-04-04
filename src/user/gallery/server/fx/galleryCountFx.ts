import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withGalleryCollectionSelectFx } from "~/user/gallery/server/db/withGalleryCollectionSelectFx";
import { withGalleryQueryBuilderFx } from "~/user/gallery/server/db/withGalleryQueryBuilderFx";
import type { GalleryCountQuerySchema } from "~/user/gallery/server/schema/GalleryCountQuerySchema";
import type { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";

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
	logger.debug("galleryCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withGalleryCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
