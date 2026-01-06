import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemCountQuerySchema } from "~/app/gallery-item/schema/GalleryItemCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryItemCountFx {
	export type Props = GalleryItemCountQuerySchema.Type;
}

export const galleryItemCountFx = Effect.fn("galleryItemCountFx")(function* ({
	filter,
	where,
}: galleryItemCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withGalleryItemSelectFx({
			database,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withGalleryItemQueryBuilder,
	});
});

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
