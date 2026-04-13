import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAgentStreamCollectionSelectFx } from "../db/withAgentStreamCollectionSelectFx";
import { withAgentStreamQueryBuilderFx } from "../db/withAgentStreamQueryBuilderFx";
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
		selectFx: withAgentStreamCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withAgentStreamQueryBuilderFx,
	});
});

export type agentStreamCollectionFx = ReturnType<typeof agentStreamCollectionFx>;
