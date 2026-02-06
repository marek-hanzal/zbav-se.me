import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import type { MessagePersonalSortSchema } from "~/@user/message-personal/schema/MessagePersonalSortSchema";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessagePersonalSelectFx {
	export interface Props {
		userId: string;
		sort?: MessagePersonalSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessagePersonalSelectFx>>;
}

export const withMessagePersonalSelectFx = Effect.fn("withMessagePersonalSelectFx")(function* ({
	userId,
	sort,
}: withMessagePersonalSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("message_personal as mp")
		.innerJoin("location as loc", "loc.id", "mp.locationId")
		.selectAll("mp")
		.select(sql<"personal">`'personal'`.as("type"))
		.select((eb) => [
			sql<LocationTableSchema.Type | null>`to_json(${eb.table("loc")}.*)`
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
			.with("createdAt", () => query.orderBy("mp.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
