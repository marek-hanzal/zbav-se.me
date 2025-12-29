import { sql } from "kysely";
import { match } from "ts-pattern";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessagePersonalSortSchema } from "~/app/message-personal/schema/MessagePersonalSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessagePersonalSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessagePersonalSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessagePersonalSelect>;
}

export const withMessagePersonalSelect = ({
	database,
	sort,
	userId,
}: withMessagePersonalSelect.Props) => {
	let query = database
		.selectFrom("message_personal as mp")
		.innerJoin("location as loc", "loc.id", "mp.locationId")
		.selectAll("mp")
		.select(sql<"personal">`'personal'`.as("type"))
		.select((eb) => [
			sql<LocationDbSchema.Type | null>`to_json(${eb.table("loc")}.*)`
				.$notNull()
				.as("location"),
			eb
				.case()
				.when("mp.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mp.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
