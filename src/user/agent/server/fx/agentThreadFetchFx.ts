import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentThreadSelectFx } from "~/user/agent/server/db/withAgentThreadSelectFx";
import type { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";

export namespace agentThreadFetchFx {
	export interface Props extends AgentThreadQuerySchema.Type {
		scope: AgentThreadFilterSchema.Type;
	}
}

export const agentThreadFetchFx = Effect.fn("agentThreadFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: agentThreadFetchFx.Props) {
	const logger = yield* getLoggerFx("agentThreadFetchFx");
	logger.trace("agentThreadFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "agent-thread",
		selectFx: withAgentThreadSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type agentThreadFetchFx = ReturnType<typeof agentThreadFetchFx>;
