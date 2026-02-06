import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import type { MessageSystemSortSchema } from "~/@user/message-system/schema/MessageSystemSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageSystemSelectFx {
	export interface Props {
		sort?: MessageSystemSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSystemSelectFx>>;
}

export const withMessageSystemSelectFx = Effect.fn("withMessageSystemSelectFx")(function* ({
	sort,
}: withMessageSystemSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("message_system as ms")
		.selectAll("ms")
		.select(sql<"system">`'system'`.as("type"))
		.select(sql<MessageDirectionEnumSchema.Type>`'system'`.as("direction"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ms.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
