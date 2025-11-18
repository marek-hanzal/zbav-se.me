import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withGalleryQueryBuilder } from "../db/withGalleryQueryBuilder";
import { withGallerySelect } from "../db/withGallerySelect";
import type { GalleryQuerySchema } from "../schema/GalleryQuerySchema";

export namespace galleryCountFx {
	export interface Props {
		database: WithDatabase;
		query: Omit<GalleryQuerySchema.Type, "cursor" | "sort">;
	}
}

export const galleryCountFx = ({ database, query: { filter, where } }: galleryCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withGallerySelect({
					database,
				}),
				filter,
				where,
				query: withGalleryQueryBuilder,
			});
		});
	});
};

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
