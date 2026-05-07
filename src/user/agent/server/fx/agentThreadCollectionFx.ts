import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";
import { withAgentThreadSelectFx } from "../db/withAgentThreadSelectFx";

export namespace agentThreadCollectionFx {
	export interface Props extends AgentThreadQuerySchema.Type {
		scope: AgentThreadFilterSchema.Type;
	}
}

export const agentThreadCollectionFx = Effect.fn("agentThreadCollectionFx")(function* ({
	filter,
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
		filter,
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
		filter,
		where,
		scope,
	});
});

export type agentThreadCollectionFx = ReturnType<typeof agentThreadCollectionFx>;
