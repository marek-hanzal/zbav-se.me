import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamQueryBuilderFx } from "~/user/agent/server/db/withAgentStreamQueryBuilderFx";
import { withAgentStreamSourceSelectFx } from "~/user/agent/server/db/withAgentStreamSourceSelectFx";
import type { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export namespace agentStreamCountFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamFilterSchema.Type;
	}
}

export const agentStreamCountFx = Effect.fn("agentStreamCountFx")(function* ({
	where,
	scope,
	filter,
}: agentStreamCountFx.Props) {
	const logger = yield* getLoggerFx("agentStreamCountFx");
	logger.debug("agentStreamCountFx", {
		where,
		scope,
		filter,
	});

	return yield* withCountFx({
		selectFx: withAgentStreamSourceSelectFx({}),
		where,
		scope,
		filter,
		queryFx: withAgentStreamQueryBuilderFx,
	});
});

export type agentStreamCountFx = ReturnType<typeof agentStreamCountFx>;
