import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemQuerySchema } from "~/app/gallery-item/schema/GalleryItemQuerySchema";

export namespace galleryItemCountFx {
	export interface Props {
		query: Omit<GalleryItemQuerySchema.Type, "cursor" | "sort">;
	}
}

export const galleryItemCountFx = ({ query: { filter, where } }: galleryItemCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withGalleryItemSelect({
					database,
				}),
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

export type galleryItemCountFx = ReturnType<typeof galleryItemCountFx>;
