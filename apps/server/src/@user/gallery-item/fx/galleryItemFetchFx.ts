import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
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
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "gallery-item",
		select: yield* withGalleryItemSelectFx({
			sort,
		}),
		output: GalleryItemSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
