import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withGalleryQueryBuilder } from "../db/withGalleryQueryBuilder";
import { withGallerySelect } from "../db/withGallerySelect";
import type { GalleryQuerySchema } from "../schema/GalleryQuerySchema";

export namespace galleryCountFx {
	export interface Props {
		query: Omit<GalleryQuerySchema.Type, "cursor" | "sort">;
	}
}

export const galleryCountFx = ({ query: { filter, where } }: galleryCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
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
