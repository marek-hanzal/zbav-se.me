import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withInboxSelectFx } from "~/user/inbox/server/db/withInboxSelectFx";
import type { InboxSortSchema } from "~/user/inbox/server/schema/InboxSortSchema";

export namespace withInboxCollectionSelectFx {
	export interface Props {
		sort?: InboxSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withInboxCollectionSelectFx>>;
}

export const withInboxCollectionSelectFx = Effect.fn("withInboxCollectionSelectFx")(function* ({
	sort,
}: withInboxCollectionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const sourceSelect = yield* withInboxSelectFx({});

	let query = kysely
		.selectFrom(
			sourceSelect
				.select((eb) =>
					sql<number>`row_number() over (
						partition by case
							when ${eb.ref("i.type")} in ('buyer-message', 'seller-message')
								then ${eb.ref("i.payload")} ->> 'transactionId'
							else ${eb.ref("i.id")}
						end
						order by ${eb.ref("i.timestamp")} desc, ${eb.ref("i.id")} desc
					)`.as("rn"),
				)
				.as("i"),
		)
		.select([
			"i.id",
			"i.userId",
			"i.reference",
			"i.timestamp",
			"i.family",
			"i.priority",
			"i.archivedAt",
			"i.type",
			"i.payload",
		])
		.where("i.rn", "=", 1)
		.$castTo<InboxTableSchema.Type>();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("timestamp", () => query.orderBy("i.timestamp", item.order))
			.with("archivedAt", () => query.orderBy("i.archivedAt", item.order))
			.with("priority", () => query.orderBy("i.priority", item.order))
			.exhaustive();
	}

	return query;
});
