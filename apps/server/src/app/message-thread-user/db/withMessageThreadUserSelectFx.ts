import { Effect } from "effect";
import { match } from "ts-pattern";
import type { MessageThreadUserSortSchema } from "~/app/message-thread-user/schema/MessageThreadUserSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageThreadUserSelectFx {
	export interface Props {
		sort?: MessageThreadUserSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageThreadUserSelectFx>>;
}

export const withMessageThreadUserSelectFx = Effect.fn("withMessageThreadUserSelectFx")(function* ({
	sort,
}: withMessageThreadUserSelectFx.Props) {
	const kysely = yield* KyselyContextFx;

	let query = kysely.selectFrom("message_thread_user as mtu").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mtu.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
