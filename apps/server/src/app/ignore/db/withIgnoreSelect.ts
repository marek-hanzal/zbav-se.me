import { match } from "ts-pattern";
import type { IgnoreSortSchema } from "~/@user/ignore/schema/IgnoreSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withIgnoreSelect {
	export interface Props {
		database: WithDatabase;
		sort: IgnoreSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withIgnoreSelect>;
}

export const withIgnoreSelect = ({ database, sort }: withIgnoreSelect.Props) => {
	let query = database.selectFrom("ignore as i").select([
		"i.id",
		"i.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("i.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
