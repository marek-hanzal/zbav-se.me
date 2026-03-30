import { Effect } from "effect";
import { match } from "ts-pattern";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { InboxSortSchema } from "~/user/inbox/server/schema/InboxSortSchema";

export namespace withInboxSelectFx {
	export interface Props {
		sort?: InboxSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withInboxSelectFx>>;
}

export const withInboxSelectFx = Effect.fn("withInboxSelectFx")(function* ({
	sort,
}: withInboxSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("inbox as i").selectAll("i").$castTo<InboxTableSchema.Type>();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("timestamp", () => query.orderBy("i.timestamp", item.order))
			.with("archivedAt", () => query.orderBy("i.archivedAt", item.order))
			.with("priority", () => query.orderBy("i.priority", item.order))
			.exhaustive();
	}

	return query;
});
