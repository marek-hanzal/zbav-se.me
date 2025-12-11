import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withGallerySelect({
					database,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withGalleryQueryBuilder,
			});
		});
	});
};

export type galleryCountFx = ReturnType<typeof galleryCountFx>;
