import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentThreadSelectFx } from "~/user/agent/server/db/withAgentThreadSelectFx";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";
import type { AgentThreadWhereSchema } from "../schema/AgentThreadWhereSchema";

export namespace agentThreadFetchFx {
	export interface Props extends AgentThreadQuerySchema.Type {
		scope: AgentThreadWhereSchema.Type;
	}
}

export const agentThreadFetchFx = Effect.fn("agentThreadFetchFx")(function* ({
	where,
	scope,
	sort,
}: agentThreadFetchFx.Props) {
	const logger = yield* getLoggerFx("agentThreadFetchFx");
	logger.trace("agentThreadFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "agent-thread",
		selectFx: withAgentThreadSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type agentThreadFetchFx = ReturnType<typeof agentThreadFetchFx>;
