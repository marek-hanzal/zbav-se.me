import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withGallerySelectFx } from "~/user-gallery/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/user-gallery/schema/GalleryQuerySchema";
import type { GalleryWhereSchema } from "~/user-gallery/schema/GalleryWhereSchema";

export namespace galleryFetchFx {
	export interface Props extends GalleryQuerySchema.Type {
		scope: GalleryWhereSchema.Type;
	}
}

export const galleryFetchFx = Effect.fn("galleryFetchFx")(function* ({
	where,
	scope,
	sort,
}: galleryFetchFx.Props) {
	const logger = yield* getLoggerFx("galleryFetchFx");
	logger.trace("galleryFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "gallery",
		selectFx: withGallerySelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
