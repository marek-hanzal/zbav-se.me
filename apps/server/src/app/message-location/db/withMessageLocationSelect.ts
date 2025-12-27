import { sql } from "kysely";
import { match } from "ts-pattern";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageLocationSortSchema } from "~/app/message-location/schema/MessageLocationSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageLocationSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessageLocationSelect>;
}

export const withMessageLocationSelect = ({
	database,
	sort,
	userId,
}: withMessageLocationSelect.Props) => {
	let query = database
		.selectFrom("message_location as ml")
		.innerJoin("location as loc", "loc.id", "ml.locationId")
		.selectAll("ml")
		.select(sql<"location">`'location'`.as("type"))
		.select((eb) => [
			sql<LocationDbSchema.Type | null>`to_json(${eb.table("loc")}.*)`
				.$notNull()
				.as("location"),
			eb
				.case()
				.when("ml.userId", "=", userId)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ml.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
