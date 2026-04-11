import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentUsageCollectionSelectFx } from "~/user/agent/server/db/withAgentUsageCollectionSelectFx";
import { withAgentUsageQueryBuilderFx } from "~/user/agent/server/db/withAgentUsageQueryBuilderFx";
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
	sort,
}: agentUsageCollectionFx.Props) {
	const logger = yield* getLoggerFx("agentUsageCollectionFx");
	logger.trace("agentUsageCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAgentUsageCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withAgentUsageQueryBuilderFx,
	});
});

export type agentUsageCollectionFx = ReturnType<typeof agentUsageCollectionFx>;
