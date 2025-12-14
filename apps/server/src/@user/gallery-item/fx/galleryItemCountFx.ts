import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withGalleryItemQueryBuilder } from "~/app/gallery-item/db/withGalleryItemQueryBuilder";
import { withGalleryItemSelect } from "~/app/gallery-item/db/withGalleryItemSelect";
import type { GalleryItemCountQuerySchema } from "~/app/gallery-item/schema/GalleryItemCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace galleryItemCountFx {
	export type Props = GalleryItemCountQuerySchema.Type;
}

export const galleryItemCountFx = (query: galleryItemCountFx.Props) => {
	const { filter, where } = query;
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
