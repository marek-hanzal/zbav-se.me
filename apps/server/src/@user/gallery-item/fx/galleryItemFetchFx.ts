import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "../schema/GalleryItemQuerySchema";
import { GalleryItemSchema } from "../schema/GalleryItemSchema";

export namespace galleryItemFetchFx {
	export interface Props {
		query: Omit<GalleryItemQuerySchema.Type, "cursor">;
	}
}

export const galleryItemFetchFx = ({ query }: galleryItemFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withGalleryItemSelect({
					database,
					sort,
				}),
				output: GalleryItemSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withGalleryItemQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "gallery-item",
				resourceId: "(query)",
				message: "Gallery item not found",
			});
		}

		return data;
	});
};

export type galleryItemFetchFx = ReturnType<typeof galleryItemFetchFx>;
