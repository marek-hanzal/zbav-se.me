import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { GalleryItemSchema } from "../schema/GalleryItemSchema";

export namespace galleryItemFetchFx {
	export type Props = GalleryItemQuerySchema.Type;
}

export const galleryItemFetchFx = Effect.fn("galleryItemFetchFx")(function* ({
	filter,
	where,
	sort,
}: galleryItemFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "gallery-item",
		select: withGalleryItemSelect({
			database,
			sort,
		}),
		output: GalleryItemSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withGalleryItemQueryBuilder,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
