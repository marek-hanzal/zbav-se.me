import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/user/gallery/server/schema/GalleryQuerySchema";
import type { GalleryWhereSchema } from "../schema/GalleryWhereSchema";

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
