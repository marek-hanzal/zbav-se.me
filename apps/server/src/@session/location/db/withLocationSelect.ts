import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { LocationSortSchema } from "../schema/LocationSortSchema";

export namespace withLocationSelect {
	export interface Props {
		sort: LocationSortSchema.Type[] | undefined;
		source: WithDatabase;
	}
	export type Select = ReturnType<typeof withLocationSelect>;
}

export const withLocationSelect = ({
	sort,
	source,
}: withLocationSelect.Props) => {
	let query = source.selectFrom("location as l").select([
		"l.id",
		"l.query",
		"l.lang",
		"l.country",
		"l.code",
		"l.county",
		"l.municipality",
		"l.state",
		"l.address",
		"l.city",
		"l.street",
		"l.zip",
		"l.confidence",
		"l.hash",
		"l.lat",
		"l.lon",
	]);

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
