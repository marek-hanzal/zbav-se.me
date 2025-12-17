import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageTextSortSchema } from "~/app/message-text/schema/MessageTextSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageTextSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageTextSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessageTextSelect>;
}

export const withMessageTextSelect = ({ database, sort, userId }: withMessageTextSelect.Props) => {
	let query = database
		.selectFrom("message_text as m")
		.selectAll("m")
		.select(sql<"text">`'text'`.as("type"))
		.select((eb) =>
			eb
				.case()
				.when("m.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("m.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
