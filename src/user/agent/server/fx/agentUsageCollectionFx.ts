import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentUsageSelectFx } from "~/user/agent/server/db/withAgentUsageSelectFx";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";
import type { AgentUsageWhereSchema } from "../schema/AgentUsageWhereSchema";

export namespace agentUsageCollectionFx {
	export interface Props extends AgentUsageQuerySchema.Type {
		scope: AgentUsageWhereSchema.Type;
	}
}

export const agentUsageCollectionFx = Effect.fn("agentUsageCollectionFx")(function* ({
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
		where,
		scope,
	});
});

export type agentUsageCollectionFx = ReturnType<typeof agentUsageCollectionFx>;
