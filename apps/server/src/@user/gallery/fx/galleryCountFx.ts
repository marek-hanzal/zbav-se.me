import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryQueryBuilder } from "~/app/gallery/db/withGalleryQueryBuilder";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { GalleryCountQuerySchema } from "~/app/gallery/schema/GalleryCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryCountFx {
	export type Props = GalleryCountQuerySchema.Type;
}

export const galleryCountFx = Effect.fn("galleryCountFx")(function* ({
	filter,
	where,
}: galleryCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: withGallerySelect({
			database,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withGalleryQueryBuilder,
	});
});

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
