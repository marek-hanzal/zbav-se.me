import type { SelectQueryBuilder } from "kysely";
import type { Database } from "../database/Database";
import type { GalleryQuerySchema } from "./schema/GalleryQuerySchema";

export namespace withGalleryQueryBuilder {
	export interface Props {
		select: SelectQueryBuilder<Database, "Gallery", any>;
		where?: GalleryQuerySchema.Type["where"];
		sort?: GalleryQuerySchema.Type["sort"];
	}

	export type Callback = (
		props: Props,
	) => SelectQueryBuilder<Database, "Gallery", any>;
}

export const withGalleryQueryBuilder: withGalleryQueryBuilder.Callback = ({
	select,
	where,
}) => {
	let query = select;

	if (where?.id) {
		query = query.where("id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("id", "in", where.idIn);
	}

	if (where?.userId) {
		query = query.where("userId", "=", where.userId);
	}

	if (where?.userIdIn && where.userIdIn.length > 0) {
		query = query.where("userId", "in", where.userIdIn);
	}

	if (where?.listingId) {
		query = query.where("listingId", "=", where.listingId);
	}

	if (where?.listingIdIn && where.listingIdIn.length > 0) {
		query = query.where("listingId", "in", where.listingIdIn);
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
					query = query.orderBy("sort", sortItem.sort);
					break;
				case "createdAt":
					query = query.orderBy("createdAt", sortItem.sort);
					break;
				case "updatedAt":
					query = query.orderBy("updatedAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
