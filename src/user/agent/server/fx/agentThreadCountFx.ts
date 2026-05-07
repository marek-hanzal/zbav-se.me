import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadCountQuerySchema } from "~/user/agent/server/schema/AgentThreadCountQuerySchema";
import type { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import { withAgentThreadSelectFx } from "../db/withAgentThreadSelectFx";

export namespace agentThreadCountFx {
	export interface Props extends AgentThreadCountQuerySchema.Type {
		scope: AgentThreadFilterSchema.Type;
	}
}

export const agentThreadCountFx = Effect.fn("agentThreadCountFx")(function* ({
	filter,
	where,
	scope,
}: agentThreadCountFx.Props) {
	const logger = yield* getLoggerFx("agentThreadCountFx");
	logger.trace("agentThreadCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withAgentThreadSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type agentThreadCountFx = ReturnType<typeof agentThreadCountFx>;
