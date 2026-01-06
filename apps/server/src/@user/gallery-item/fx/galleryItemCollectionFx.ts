import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: withGalleryItemSelect({
			database,
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
		query: withGalleryItemQueryBuilder,
	});
});

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;
