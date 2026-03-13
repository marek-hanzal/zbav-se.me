import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { withInboxQueryBuilderFx } from "~/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";
import type { InboxSortSchema } from "~/@user/inbox/schema/InboxSortSchema";
import type { InboxTableSchema } from "~/database/@table/InboxTableSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withInboxCollectionSelectFx {
	export interface Props {
		layers?: Array<InboxFilterSchema.Type | undefined>;
		sort?: InboxSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withInboxCollectionSelectFx>>;
}

export const withInboxCollectionSelectFx = Effect.fn("withInboxCollectionSelectFx")(function* ({
	layers,
	sort,
}: withInboxCollectionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	let sourceSelect = yield* withInboxSelectFx({});

	for (const layer of layers ?? []) {
		sourceSelect = yield* withInboxQueryBuilderFx({
			select: sourceSelect,
			where: layer,
		});
	}

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
