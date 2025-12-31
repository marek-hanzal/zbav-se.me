import { match } from "ts-pattern";
import type { UserEventSortSchema } from "~/app/user-event/schema/UserEventSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withUserEventCollectionSelect {
	export interface Props {
		database: WithDatabase;
		sort: UserEventSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withUserEventCollectionSelect>;
}

export const withUserEventCollectionSelect = ({
	database,
	sort,
}: withUserEventCollectionSelect.Props) => {
	let query = database.selectFrom("user_event as ue").selectAll("ue");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ue.createdAt", item.direction))
			.with("group", () => query.orderBy("ue.group", item.direction))
			.exhaustive();
	}

	return query;
};
