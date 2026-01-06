import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryCollectionFx {
	export type Props = GalleryQuerySchema.Type;
}

export const galleryCollectionFx = Effect.fn("galleryCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: galleryCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withGallerySelectFx({
			sort,
		}),
		output: GallerySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
