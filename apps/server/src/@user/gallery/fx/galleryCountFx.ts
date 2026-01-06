import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryQueryBuilderFx } from "~/app/gallery/db/withGalleryQueryBuilderFx";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryCountQuerySchema } from "~/app/gallery/schema/GalleryCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace galleryCountFx {
	export type Props = GalleryCountQuerySchema.Type;
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
}: galleryCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		selectFx: withGallerySelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withGalleryQueryBuilderFx,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
