import { Effect } from "effect";
import type { AgentUsageWhereSchema } from "~/user/agent/server/schema/AgentUsageWhereSchema";
import type { withAgentUsageSourceSelectFx } from "./withAgentUsageSourceSelectFx";

export namespace withAgentUsageQueryBuilderFx {
	export interface Props<
		TSelect extends withAgentUsageSourceSelectFx.Select = withAgentUsageSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: AgentUsageWhereSchema.Type;
	}

	export type Callback = <TSelect extends withAgentUsageSourceSelectFx.Select>(
		props: withAgentUsageQueryBuilderFx.Props<TSelect>,
	) => Effect.Effect.Success<ReturnType<typeof withAgentUsageQueryBuilderFx>>;
}

export const withAgentUsageQueryBuilderFx = Effect.fn("withAgentUsageQueryBuilderFx")(function* <
	TSelect extends withAgentUsageSourceSelectFx.Select,
>({ select, where }: withAgentUsageQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("au.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("au.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("au.userId", "=", where.userId) as TSelect;
	}

	if (where.threadId) {
		query = query.where("au.threadId", "=", where.threadId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
