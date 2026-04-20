import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AgentThreadSortSchema } from "~/user/agent/server/schema/AgentThreadSortSchema";

export namespace withAgentThreadSourceSelectFx {
	export interface Props {
		sort?: AgentThreadSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentThreadSourceSelectFx>>;
}

export const withAgentThreadSourceSelectFx = Effect.fn("withAgentThreadSourceSelectFx")(function* ({
	sort,
}: withAgentThreadSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("agent_thread as at");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("at.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("at.updatedAt", item.order))
			.exhaustive();
	}

	return query;
});
