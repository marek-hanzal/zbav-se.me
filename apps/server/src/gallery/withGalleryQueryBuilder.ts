import type { GalleryQuerySchema } from "./schema/GalleryQuerySchema";
import type { withGallerySelect } from "./withGallerySelect";

export namespace withGalleryQueryBuilder {
	export interface Props {
		select: withGallerySelect.Select;
		where?: GalleryQuerySchema.Type["where"];
		sort?: GalleryQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withGallerySelect.Select;
}

export const withGalleryQueryBuilder: withGalleryQueryBuilder.Callback = ({
	select,
	where,
}) => {
	let query = select;

	if (where?.id) {
		query = query.where("g.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("g.id", "in", where.idIn);
	}

	if (where?.userId) {
		query = query.where("g.userId", "=", where.userId);
	}

	if (where?.userIdIn && where.userIdIn.length > 0) {
		query = query.where("g.userId", "in", where.userIdIn);
	}

	if (where?.listingId) {
		query = query.where("g.listingId", "=", where.listingId);
	}

	if (where?.listingIdIn && where.listingIdIn.length > 0) {
		query = query.where("g.listingId", "in", where.listingIdIn);
	}

	return query;
};

export const withGalleryQueryBuilderWithSort = (
	props: withGalleryQueryBuilder.Props,
) => {
	let query = withGalleryQueryBuilder(props);

	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "sort":
					query = query.orderBy("g.sort", sortItem.sort);
					break;
				case "createdAt":
					query = query.orderBy("g.createdAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
