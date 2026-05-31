import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamSelectFx } from "~/user/agent/server/db/withAgentStreamSelectFx";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";
import type { AgentStreamWhereSchema } from "../schema/AgentStreamWhereSchema";

export namespace agentStreamFetchFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamWhereSchema.Type;
	}
}

export const agentStreamFetchFx = Effect.fn("agentStreamFetchFx")(function* ({
	where,
	scope,
	sort,
}: agentStreamFetchFx.Props) {
	const logger = yield* getLoggerFx("agentStreamFetchFx");
	logger.trace("agentStreamFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "agent-stream",
		selectFx: withAgentStreamSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type agentStreamFetchFx = ReturnType<typeof agentStreamFetchFx>;
