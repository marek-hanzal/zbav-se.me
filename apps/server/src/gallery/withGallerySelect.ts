import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { GallerySortSchema } from "./schema/GallerySortSchema";

export namespace withGallerySelect {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withGallerySelect>;
}

export const withGallerySelect = ({ sort }: withGallerySelect.Props = {}) => {
	let query = database.kysely.selectFrom("gallery as g").selectAll("g");

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("sort", () => query.orderBy("g.sort", key))
			.with("createdAt", () => query.orderBy("g.createdAt", key))
			.exhaustive();
	}

	return query;
};
