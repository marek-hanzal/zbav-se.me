import { Effect } from "effect";
import type { GalleryItemFilterSchema } from "~/app/gallery-item/schema/GalleryItemFilterSchema";
import type { withGalleryItemSelectFx } from "./withGalleryItemSelectFx";

export namespace withGalleryItemQueryBuilderFx {
	export interface Props {
		select: withGalleryItemSelectFx.Select;
		where?: GalleryItemFilterSchema.Type;
	}

	export type Callback = (props: Props) => withGalleryItemSelectFx.Select;
}

export const withGalleryItemQueryBuilderFx = Effect.fn("withGalleryItemQueryBuilderFx")(function* ({
	select,
	where,
}: withGalleryItemQueryBuilderFx.Props) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("gal_item.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("gal_item.id", "in", where.idIn);
	}

	if (where.userId) {
		const userId = where.userId;
		query = query.where((eb) =>
			eb.exists(
				eb
					.selectFrom("gallery as gal")
					.select("gal.id")
					.whereRef("gal.id", "=", "gal_item.galleryId")
					.where("gal.userId", "=", userId),
			),
		);
	}

	if (where.galleryId) {
		query = query.where("gal_item.galleryId", "=", where.galleryId);
	}

	return yield* Effect.succeed(query);
});
