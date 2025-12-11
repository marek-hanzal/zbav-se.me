import { match } from "ts-pattern";
import type { FlagSortSchema } from "~/@user/flag/schema/FlagSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withFlagSelect {
	export interface Props {
		database: WithDatabase;
		sort: FlagSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withFlagSelect>;
}

export const withFlagSelect = ({ database, sort }: withFlagSelect.Props) => {
	let query = database.selectFrom("flag as f").select([
		"f.id",
		"f.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
