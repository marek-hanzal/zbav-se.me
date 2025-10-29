import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { LocationSortSchema } from "./schema/LocationSortSchema";

export namespace withLocationSelect {
	export interface Props {
		sort?: LocationSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withLocationSelect>;
}

export const withLocationSelect = ({ sort }: withLocationSelect.Props = {}) => {
	let query = database.kysely.selectFrom("location as l").selectAll("l");

	for (const sortItem of sort ?? []) {
		if (!sortItem.sort) {
			continue;
		}
		const { sort: key, value } = sortItem;

		query = match(value)
			.with("confidence", () => query.orderBy("l.confidence", key))
			.with("query", () => query.orderBy("l.query", key))
			.with("country", () => query.orderBy("l.country", key))
			.with("address", () => query.orderBy("l.address", key))
			.exhaustive();
	}

	return query;
};
