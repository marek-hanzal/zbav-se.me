import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withGalleryItemQueryBuilder } from "../db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "../db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "../schema/GalleryItemQuerySchema";
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
