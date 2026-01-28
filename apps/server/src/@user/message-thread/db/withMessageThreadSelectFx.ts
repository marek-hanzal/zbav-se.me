import { Effect } from "effect";
import { match } from "ts-pattern";
import type { MessageThreadSortSchema } from "~/@user/message-thread/schema/MessageThreadSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageThreadSelectFx {
	export interface Props {
		sort?: MessageThreadSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageThreadSelectFx>>;
}

export const withMessageThreadSelectFx = Effect.fn("withMessageThreadSelectFx")(function* ({
	sort,
}: withMessageThreadSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("message_thread as mt").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("mt.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
});
