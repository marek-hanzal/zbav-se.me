import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
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

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withGallerySelect({
					database,
					sort,
				}),
				output: GallerySchema,
				filter,
				where,
				query: withGalleryQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "gallery",
				resourceId: "(query)",
				message: "Gallery item not found",
			});
		}

		return data;
	});
};

export type galleryFetchFx = ReturnType<typeof galleryFetchFx>;
