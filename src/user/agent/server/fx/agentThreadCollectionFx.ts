import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";
import { withAgentThreadSelectFx } from "../db/withAgentThreadSelectFx";
import type { AgentThreadWhereSchema } from "../schema/AgentThreadWhereSchema";

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
