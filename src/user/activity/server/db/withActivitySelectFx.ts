import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ActivitySortSchema } from "~/user/activity/server/schema/ActivitySortSchema";

export namespace withActivitySelectFx {
	export interface Props {
		sort?: ActivitySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withActivitySelectFx>>;
}

export const withActivitySelectFx = Effect.fn("withActivitySelectFx")(function* ({
	sort,
}: withActivitySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("activity as i")
		.selectAll("i")
		.$castTo<ActivityTableSchema.Type>();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("timestamp", () => query.orderBy("i.timestamp", item.order))
			.with("archivedAt", () => query.orderBy("i.archivedAt", item.order))
			.with("priority", () => query.orderBy("i.priority", item.order))
			.exhaustive();
	}

	return query;
});
