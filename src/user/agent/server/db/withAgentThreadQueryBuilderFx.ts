import { Effect } from "effect";
import { match } from "ts-pattern";
import type { AgentThreadWhereSchema } from "~/user/agent/server/schema/AgentThreadWhereSchema";
import type { withAgentThreadSourceSelectFx } from "./withAgentThreadSourceSelectFx";

export namespace withAgentThreadQueryBuilderFx {
	export interface Props<
		TSelect extends withAgentThreadSourceSelectFx.Select = withAgentThreadSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: AgentThreadWhereSchema.Type;
	}

	export type Callback = <TSelect extends withAgentThreadSourceSelectFx.Select>(
		props: withAgentThreadQueryBuilderFx.Props<TSelect>,
	) => Effect.Effect.Success<ReturnType<typeof withAgentThreadQueryBuilderFx>>;
}

export const withAgentThreadQueryBuilderFx = Effect.fn("withAgentThreadQueryBuilderFx")(function* <
	TSelect extends withAgentThreadSourceSelectFx.Select,
>({ select, where }: withAgentThreadQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("at.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("at.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("at.userId", "=", where.userId) as TSelect;
	}

	if (where.archivedAt) {
		query = match(where.archivedAt)
			.with("archived", () => query.where("at.archivedAt", "is not", null) as TSelect)
			.with("active", () => query.where("at.archivedAt", "is", null) as TSelect)
			.with("any", () => query)
			.exhaustive();
	}

	return yield* Effect.succeed(query);
});
