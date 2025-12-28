import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageDateSortSchema } from "~/app/message-date/schema/MessageDateSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageDateSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageDateSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessageDateSelect>;
}

export const withMessageDateSelect = ({ database, sort, userId }: withMessageDateSelect.Props) => {
	let query = database
		.selectFrom("message_date as md")
		.selectAll("md")
		.select(sql<"date">`'date'`.as("type"))
		.select((eb) => [
			eb
				.case()
				.when("md.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("md.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
