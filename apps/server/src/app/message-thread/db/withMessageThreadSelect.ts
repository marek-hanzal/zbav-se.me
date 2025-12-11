import { match } from "ts-pattern";
import type { MessageThreadSortSchema } from "~/app/message-thread/schema/MessageThreadSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageThreadSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageThreadSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageThreadSelect>;
}

export const withMessageThreadSelect = ({ database, sort }: withMessageThreadSelect.Props) => {
	let query = database.selectFrom("message_thread as mt").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("mt.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
