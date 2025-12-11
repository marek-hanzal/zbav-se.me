import { sql } from "kysely";
import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { MessageSortSchema } from "../schema/MessageSortSchema";

export namespace withMessageSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageSelect>;
}

export const withMessageSelect = ({ database, sort }: withMessageSelect.Props) => {
	let query = database
		.selectFrom("message as m")
		.selectAll()
		.select(sql<"message">`'message'`.as("event"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("m.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
