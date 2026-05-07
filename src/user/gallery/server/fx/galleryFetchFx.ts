import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";
import type { GalleryFilterSchema } from "~/user/gallery/server/schema/GalleryFilterSchema";
import type { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";

export namespace galleryFetchFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryFilterSchema.Type;
	}
}

export const galleryFetchFx = Effect.fn("galleryFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: galleryFetchFx.Props) {
	const logger = yield* getLoggerFx("galleryFetchFx");
	logger.trace("galleryFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "gallery",
		selectFx: withGallerySelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
