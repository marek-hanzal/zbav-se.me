import type { GalleryItemFilterSchema } from "~/@user/gallery-item/schema/GalleryItemFilterSchema";
import type { withGalleryItemSelect } from "./withGalleryItemSelect";

export namespace withGalleryItemQueryBuilder {
	export interface Props {
		select: withGalleryItemSelect.Select;
		where?: GalleryItemFilterSchema.Type;
	}

	export type Callback = (props: Props) => withGalleryItemSelect.Select;
}

export const withGalleryItemQueryBuilder: withGalleryItemQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}
	let query = select;

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

	return query;
};
