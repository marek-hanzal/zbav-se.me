import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentStreamWhereSchema } from "~/user/agent/server/schema/AgentStreamWhereSchema";
import type { withAgentStreamSourceSelectFx } from "./withAgentStreamSourceSelectFx";

export namespace withAgentStreamQueryBuilderFx {
	export interface Props<
		TSelect extends withAgentStreamSourceSelectFx.Select = withAgentStreamSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: AgentStreamWhereSchema.Type;
	}

	export type Callback = <TSelect extends withAgentStreamSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withAgentStreamQueryBuilderFx = Effect.fn("withAgentStreamQueryBuilderFx")(function* <
	TSelect extends withAgentStreamSourceSelectFx.Select,
>({ select, where }: withAgentStreamQueryBuilderFx.Props<TSelect>) {
	const logger = yield* getLoggerFx("withAgentStreamQueryBuilderFx");

	logger.trace("withAgentStreamQueryBuilderFx", {
		where,
	});

	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("as.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("as.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("as.userId", "=", where.userId) as TSelect;
	}

	if (where.threadId) {
		query = query.where("as.threadId", "=", where.threadId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
