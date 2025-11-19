import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withGalleryQueryBuilder } from "../db/withGalleryQueryBuilder";
import { withGallerySelect } from "../db/withGallerySelect";
import type { GalleryQuerySchema } from "../schema/GalleryQuerySchema";
import { GallerySchema } from "../schema/GallerySchema";

export namespace galleryCollectionFx {
	export interface Props {
		query: GalleryQuerySchema.Type;
	}
}

export const galleryCollectionFx = ({
	query: { cursor, filter, where, sort },
}: galleryCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
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
