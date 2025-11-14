import type { GalleryFilterSchema } from "../schema/GalleryFilterSchema";
import type { withGallerySelect } from "./withGallerySelect";

export namespace withGalleryQueryBuilder {
	export interface Props {
		select: withGallerySelect.Select;
		where?: GalleryFilterSchema.Type;
	}

	export type Callback = (props: Props) => withGallerySelect.Select;
}

export const withGalleryQueryBuilder: withGalleryQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("g.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("g.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("g.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("g.listingId", "=", where.listingId);
	}

	return query;
};
