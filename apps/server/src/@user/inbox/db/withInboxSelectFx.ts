import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { InboxPayloadSchema } from "~/@user/inbox/schema/InboxPayloadSchema";
import type { InboxSortSchema } from "~/@user/inbox/schema/InboxSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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

	let query = kysely.selectFrom("inbox as i").select([
		"i.id",
		"i.userId",
		"i.timestamp",
		"i.type",
		sql<InboxPayloadSchema.Type>`i.payload`.as("payload"),
		"i.priority",
		"i.archivedAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("timestamp", () => query.orderBy("i.timestamp", item.order))
			.with("archivedAt", () => query.orderBy("i.archivedAt", item.order))
			.with("priority", () => query.orderBy("i.priority", item.order))
			.exhaustive();
	}

	return query;
});
