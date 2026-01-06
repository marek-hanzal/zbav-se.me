import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilder } from "~/app/gallery/db/withGalleryQueryBuilder";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
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
		select: withGallerySelect({
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
