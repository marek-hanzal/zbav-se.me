import { match } from "ts-pattern";
import type { DraftSortSchema } from "~/app/draft/schema/DraftSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withDraftCollectionSelect {
	export interface Props {
		database: WithDatabase;
		sort: DraftSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withDraftCollectionSelect>;
}

export const withDraftCollectionSelect = ({ database, sort }: withDraftCollectionSelect.Props) => {
	let query = database
		.selectFrom("draft as d")
		.leftJoin("location as loc", "loc.id", "d.locationId")
		.leftJoin("category as cat", "cat.id", "d.categoryId")
		.select("d.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("d.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("d.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
