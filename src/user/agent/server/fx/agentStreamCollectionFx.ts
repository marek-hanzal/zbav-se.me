import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamSelectFx } from "../db/withAgentStreamSelectFx";
import type { AgentStreamQuerySchema } from "../schema/AgentStreamQuerySchema";
import { AgentStreamWhereSchema } from "../schema/AgentStreamWhereSchema";

export namespace agentStreamCollectionFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamWhereSchema.Type;
	}
}

export const agentStreamCollectionFx = Effect.fn("agentStreamCollectionFx")(function* ({
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
		where,
		scope,
	});
});

export type agentStreamCollectionFx = ReturnType<typeof agentStreamCollectionFx>;
