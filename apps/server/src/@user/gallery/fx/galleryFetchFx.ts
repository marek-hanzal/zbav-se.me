import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryFetchFx {
	export type Props = GalleryQuerySchema.Type;
}

export const galleryFetchFx = Effect.fn("galleryFetchFx")(function* ({
	filter,
	where,
	sort,
}: galleryFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "gallery",
		select: yield* withGallerySelectFx({
			sort,
		}),
		output: GallerySchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
