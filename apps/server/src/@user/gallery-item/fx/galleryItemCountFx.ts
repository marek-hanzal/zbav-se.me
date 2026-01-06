import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemQueryBuilderFx } from "~/app/gallery-item/db/withGalleryItemQueryBuilderFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemCountQuerySchema } from "~/app/gallery-item/schema/GalleryItemCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace galleryItemCountFx {
	export type Props = GalleryItemCountQuerySchema.Type;
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	filter,
	where,
}: galleryItemCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withGalleryItemSelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryItemQueryBuilderFx,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
