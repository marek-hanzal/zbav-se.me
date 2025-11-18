import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withGalleryQueryBuilder } from "../db/withGalleryQueryBuilder";
import { withGallerySelect } from "../db/withGallerySelect";
import type { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryCollectionFx {
	export interface Props {
		database: WithDatabase;
		query: GalleryQuerySchema.Type;
	}
}

export const galleryCollectionFx = ({
	database,
	query: { cursor, filter, where, sort },
}: galleryCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withGallerySelect({
					database,
					sort,
				}),
				output: GallerySchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withGalleryQueryBuilder,
			});
		});
	});
};

export type galleryCollectionFx = ReturnType<typeof galleryCollectionFx>;
