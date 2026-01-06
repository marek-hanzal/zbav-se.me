import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryQueryBuilder } from "~/app/gallery/db/withGalleryQueryBuilder";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withGallerySelectFx({
			database,
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
		query: withGalleryQueryBuilder,
	});
});

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
