import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { LocationSortSchema } from "../schema/LocationSortSchema";

export namespace withLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: LocationSortSchema.Type[] | undefined;
	}
	export type Select = ReturnType<typeof withLocationSelect>;
}

export const withLocationSelect = ({ database, sort }: withLocationSelect.Props) => {
	let query = database.selectFrom("location as loc").select([
		"loc.id",
		"loc.query",
		"loc.lang",
		"loc.country",
		"loc.code",
		"loc.county",
		"loc.municipality",
		"loc.state",
		"loc.address",
		"loc.city",
		"loc.street",
		"loc.zip",
		"loc.confidence",
		"loc.hash",
		"loc.lat",
		"loc.lon",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("confidence", () => query.orderBy("loc.confidence", item.direction))
			.with("query", () => query.orderBy("loc.query", item.direction))
			.with("country", () => query.orderBy("loc.country", item.direction))
			.with("address", () => query.orderBy("loc.address", item.direction))
			.exhaustive();
	}

	return query;
};
