import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { UserEventSortSchema } from "../schema/UserEventSortSchema";

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
			.with("createdAt", () => query.orderBy("ue.createdAt", item.order))
			.with("group", () => query.orderBy("ue.group", item.order))
			.with("id", () => query.orderBy("ue.id", item.order))
			.exhaustive();
	}

	return query;
});
