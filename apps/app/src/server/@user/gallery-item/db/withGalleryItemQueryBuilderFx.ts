import { Effect } from "effect";
import type { withGalleryItemSourceSelectFx } from "~/server/@user/gallery-item/db/withGalleryItemSourceSelectFx";
import type { GalleryItemFilterSchema } from "~/server/@user/gallery-item/schema/GalleryItemFilterSchema";

export namespace withGalleryItemQueryBuilderFx {
	export interface Props<
		TSelect extends withGalleryItemSourceSelectFx.Select = withGalleryItemSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: GalleryItemFilterSchema.Type;
	}

	export type Callback = <TSelect extends withGalleryItemSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withGalleryItemQueryBuilderFx = Effect.fn("withGalleryItemQueryBuilderFx")(function* <
	TSelect extends withGalleryItemSourceSelectFx.Select,
>({ select, where }: withGalleryItemQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("gal_item.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("gal_item.id", "in", where.idIn) as TSelect;
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
		) as TSelect;
	}

	if (where.galleryId) {
		query = query.where("gal_item.galleryId", "=", where.galleryId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
