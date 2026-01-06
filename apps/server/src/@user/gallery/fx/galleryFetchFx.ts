import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilder } from "~/app/gallery/db/withGalleryQueryBuilder";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryFetchFx {
	export type Props = GalleryQuerySchema.Type;
}

export const galleryFetchFx = Effect.fn("galleryFetchFx")(function* ({
	filter,
	where,
	sort,
}: galleryFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "gallery",
		select: yield* withGallerySelectFx({
			database,
			sort,
		}),
		output: GallerySchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withGalleryQueryBuilder,
	});
});

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
