import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { GalleryItemSchema } from "../schema/GalleryItemSchema";

export namespace galleryItemCollectionFx {
	export type Props = GalleryItemQuerySchema.Type;
}

export const galleryItemCollectionFx = Effect.fn("galleryItemCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: galleryItemCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withGalleryItemSelectFx({
			sort,
		}),
		output: GalleryItemSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;
