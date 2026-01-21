import { Effect } from "effect";
import { match } from "ts-pattern";
import type { UserEventSortSchema } from "~/app/user-event/schema/UserEventSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withUserEventSourceSelectFx {
	export interface Props {
		sort?: UserEventSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUserEventSourceSelectFx>>;
}

export const withUserEventSourceSelectFx = Effect.fn("withUserEventSourceSelectFx")(function* ({
	sort,
}: withUserEventSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("user_event as ue");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ue.createdAt", item.direction))
			.with("group", () => query.orderBy("ue.group", item.direction))
			.with("id", () => query.orderBy("ue.id", item.direction))
			.exhaustive();
	}

	return query;
});
