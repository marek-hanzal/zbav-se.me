import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentUsageSelectFx } from "~/user/agent/server/db/withAgentUsageSelectFx";
import type { AgentUsageFilterSchema } from "~/user/agent/server/schema/AgentUsageFilterSchema";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";

export namespace agentUsageCollectionFx {
	export interface Props extends AgentUsageQuerySchema.Type {
		scope: AgentUsageFilterSchema.Type;
	}
}

export const agentUsageCollectionFx = Effect.fn("agentUsageCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 256,
	},
	limit,
	sort,
}: agentUsageCollectionFx.Props) {
	const logger = yield* getLoggerFx("agentUsageCollectionFx");
	logger.trace("agentUsageCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAgentUsageSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type agentUsageCollectionFx = ReturnType<typeof agentUsageCollectionFx>;
