import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withAgentThreadSelectFx } from "~/user-agent/db/withAgentThreadSelectFx";
import type { AgentThreadQuerySchema } from "~/user-agent/schema/AgentThreadQuerySchema";
import type { AgentThreadWhereSchema } from "~/user-agent/schema/AgentThreadWhereSchema";

export namespace agentThreadCollectionFx {
	export interface Props extends AgentThreadQuerySchema.Type {
		scope: AgentThreadWhereSchema.Type;
	}
}

export const agentThreadCollectionFx = Effect.fn("agentThreadCollectionFx")(function* ({
	where,
	scope,
	cursor = {
		page: 0,
		size: 256,
	},
	limit,
	sort,
}: agentThreadCollectionFx.Props) {
	const logger = yield* getLoggerFx("agentThreadCollectionFx");
	logger.trace("agentThreadCollectionFx", {
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAgentThreadSelectFx({
			sort,
		}),
		cursor,
		limit,
		where,
		scope,
	});
});

export type agentThreadCollectionFx = ReturnType<typeof agentThreadCollectionFx>;
