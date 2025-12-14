import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withGalleryQueryBuilder } from "~/app/gallery/db/withGalleryQueryBuilder";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { GalleryQuerySchema } from "~/app/gallery/schema/GalleryQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryFetchFx {
	export type Props = GalleryQuerySchema.Type;
}

export const galleryFetchFx = (query: galleryFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
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

		if (!data) {
			return yield* new NotFoundError({
				resource: "gallery",
				resourceId: "(query)",
				message: "Gallery not found",
			});
		}

		return data;
	});
};

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
