import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageSystemSortSchema } from "~/app/message-system/schema/MessageSystemSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withMessageSystemSelectFx {
	export interface Props {
		sort?: MessageSystemSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSystemSelectFx>>;
}

export const withMessageSystemSelectFx = Effect.fn("withMessageSystemSelectFx")(function* ({
	sort,
}: withMessageSystemSelectFx.Props) {
	const database = yield* DatabaseContextFx;

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
});
