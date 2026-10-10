import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withAgentStreamSelectFx } from "~/user-agent/db/withAgentStreamSelectFx";
import type { AgentStreamQuerySchema } from "~/user-agent/schema/AgentStreamQuerySchema";
import type { AgentStreamWhereSchema } from "~/user-agent/schema/AgentStreamWhereSchema";

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
