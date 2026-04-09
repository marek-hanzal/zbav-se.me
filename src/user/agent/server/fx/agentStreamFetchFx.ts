import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamQueryBuilderFx } from "~/user/agent/server/db/withAgentStreamQueryBuilderFx";
import { withAgentStreamSelectFx } from "~/user/agent/server/db/withAgentStreamSelectFx";
import type { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export namespace agentStreamFetchFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamFilterSchema.Type;
	}
}

export const agentStreamFetchFx = Effect.fn("agentStreamFetchFx")(function* ({
	where,
	scope,
	sort,
}: agentStreamFetchFx.Props) {
	const logger = yield* getLoggerFx("agentStreamFetchFx");
	logger.debug("agentStreamFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "agent_stream",
		selectFx: withAgentStreamSelectFx({
			sort,
		}),
		where,
		scope,
		queryFx: withAgentStreamQueryBuilderFx,
	});
});

export type agentStreamFetchFx = ReturnType<typeof agentStreamFetchFx>;
