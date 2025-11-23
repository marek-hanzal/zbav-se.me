import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withGalleryQueryBuilder } from "../db/withGalleryQueryBuilder";
import { withGallerySelect } from "../db/withGallerySelect";
import type { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryFetchFx {
	export interface Props {
		query: Omit<GalleryQuerySchema.Type, "cursor">;
	}
}

export const galleryFetchFx = ({ query }: galleryFetchFx.Props) => {
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
