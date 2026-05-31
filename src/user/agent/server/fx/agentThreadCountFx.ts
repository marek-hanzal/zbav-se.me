import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadCountQuerySchema } from "~/user/agent/server/schema/AgentThreadCountQuerySchema";
import { withAgentThreadSelectFx } from "../db/withAgentThreadSelectFx";
import type { AgentThreadWhereSchema } from "../schema/AgentThreadWhereSchema";

export namespace agentThreadCountFx {
	export interface Props extends AgentThreadCountQuerySchema.Type {
		scope: AgentThreadWhereSchema.Type;
	}
}

export const agentThreadCountFx = Effect.fn("agentThreadCountFx")(function* ({
	where,
	scope,
}: agentThreadCountFx.Props) {
	const logger = yield* getLoggerFx("agentThreadCountFx");
	logger.trace("agentThreadCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withAgentThreadSelectFx({}),
		where,
		scope,
	});
});

export type agentThreadCountFx = ReturnType<typeof agentThreadCountFx>;
