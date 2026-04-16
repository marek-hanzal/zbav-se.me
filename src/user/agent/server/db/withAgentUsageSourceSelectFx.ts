import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AgentUsageSortSchema } from "~/user/agent/server/schema/AgentUsageSortSchema";

export namespace withAgentUsageSourceSelectFx {
	export interface Props {
		sort?: AgentUsageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentUsageSourceSelectFx>>;
}

export const withAgentUsageSourceSelectFx = Effect.fn("withAgentUsageSourceSelectFx")(function* ({
	sort,
}: withAgentUsageSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("agent_usage as au");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("au.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
