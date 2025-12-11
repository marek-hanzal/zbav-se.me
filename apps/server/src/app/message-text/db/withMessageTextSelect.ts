import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageTextSortSchema } from "~/app/message-text/schema/MessageTextSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageTextSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageTextSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageTextSelect>;
}

export const withMessageTextSelect = ({ database, sort }: withMessageTextSelect.Props) => {
	let query = database
		.selectFrom("message_text as m")
		.select([
			"m.id",
			"m.messageThreadId",
			"m.side",
			"m.text as message",
			"m.createdAt",
		])
		.select(sql<"text">`'text'`.as("type"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("m.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
