import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamSelectFx } from "../db/withAgentStreamSelectFx";
import type { AgentStreamFilterSchema } from "../schema/AgentStreamFilterSchema";
import type { AgentStreamQuerySchema } from "../schema/AgentStreamQuerySchema";

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
		size: 256,
	},
	limit,
	sort,
}: agentStreamCollectionFx.Props) {
	const logger = yield* getLoggerFx("agentStreamCollectionFx");
	logger.trace("agentStreamCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAgentStreamSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type agentStreamCollectionFx = ReturnType<typeof agentStreamCollectionFx>;
