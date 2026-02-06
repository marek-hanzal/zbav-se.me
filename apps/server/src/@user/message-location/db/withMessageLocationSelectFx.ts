import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import type { MessageLocationSortSchema } from "~/@user/message-location/schema/MessageLocationSortSchema";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageLocationSelectFx {
	export interface Props {
		userId: string;
		sort?: MessageLocationSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageLocationSelectFx>>;
}

export const withMessageLocationSelectFx = Effect.fn("withMessageLocationSelectFx")(function* ({
	userId,
	sort,
}: withMessageLocationSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("message_location as ml")
		.innerJoin("location as loc", "loc.id", "ml.locationId")
		.selectAll("ml")
		.select(sql<"location">`'location'`.as("type"))
		.select((eb) => [
			sql<LocationTableSchema.Type | null>`to_json(${eb.table("loc")}.*)`
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
			.with("createdAt", () => query.orderBy("ml.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
