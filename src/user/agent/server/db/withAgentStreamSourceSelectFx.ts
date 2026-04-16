import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AgentStreamSortSchema } from "~/user/agent/server/schema/AgentStreamSortSchema";

export namespace withAgentStreamSourceSelectFx {
	export interface Props {
		sort?: AgentStreamSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentStreamSourceSelectFx>>;
}

export const withAgentStreamSourceSelectFx = Effect.fn("withAgentStreamSourceSelectFx")(function* ({
	sort,
}: withAgentStreamSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("agent_stream as as");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("as.sort", item.order))
			.exhaustive();
	}

	return query;
});
