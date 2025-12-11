import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { GalleryItemSchema } from "../schema/GalleryItemSchema";

export namespace galleryItemCollectionFx {
	export interface Props {
		query: GalleryItemQuerySchema.Type;
	}
}

export const galleryItemCollectionFx = ({
	query: { cursor, filter, where, sort },
}: galleryItemCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withGalleryItemSelect({
					database,
					sort,
				}),
				output: GalleryItemSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withGalleryItemQueryBuilder,
			});
		});
	});
};

export type galleryItemCollectionFx = ReturnType<typeof galleryItemCollectionFx>;
