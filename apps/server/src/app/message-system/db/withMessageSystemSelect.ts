import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageSystemSortSchema } from "~/app/message-system/schema/MessageSystemSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageSystemSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageSystemSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withMessageSystemSelect>;
}

export const withMessageSystemSelect = ({ database, sort }: withMessageSystemSelect.Props) => {
	let query = database
		.selectFrom("message_system as ms")
		.selectAll("ms")
		.select(sql<"system">`'system'`.as("type"))
		.select(sql<MessageDirectionEnumSchema.Type>`'system'`.as("direction"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ms.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
