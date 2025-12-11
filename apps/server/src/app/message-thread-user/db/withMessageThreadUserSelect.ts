import { match } from "ts-pattern";
import type { MessageThreadUserSortSchema } from "~/app/message-thread-user/schema/MessageThreadUserSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageThreadUserSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageThreadUserSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageThreadUserSelect>;
}

export const withMessageThreadUserSelect = ({
	database,
	sort,
}: withMessageThreadUserSelect.Props) => {
	let query = database.selectFrom("message_thread_user as mtu").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mtu.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
