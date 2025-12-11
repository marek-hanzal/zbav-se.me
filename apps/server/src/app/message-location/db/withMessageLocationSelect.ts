import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { MessageLocationSortSchema } from "~/@user/message-location/schema/MessageLocationSortSchema";

export namespace withMessageLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageLocationSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageLocationSelect>;
}

export const withMessageLocationSelect = ({ database, sort }: withMessageLocationSelect.Props) => {
	let query = database.selectFrom("message_location as ml").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ml.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
