import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamCollectionSelectFx } from "~/user/agent/server/db/withAgentStreamCollectionSelectFx";
import { withAgentStreamQueryBuilderFx } from "~/user/agent/server/db/withAgentStreamQueryBuilderFx";
import type { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export namespace agentStreamCollectionFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamFilterSchema.Type;
	}
}

export const agentStreamCollectionFx = Effect.fn("agentStreamCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
}: agentStreamCollectionFx.Props) {
	const logger = yield* getLoggerFx("agentStreamCollectionFx");
	logger.trace("agentStreamCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAgentStreamCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withAgentStreamQueryBuilderFx,
	});
});

export type agentStreamCollectionFx = ReturnType<typeof agentStreamCollectionFx>;
