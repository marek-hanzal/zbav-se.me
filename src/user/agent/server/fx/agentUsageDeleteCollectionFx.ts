import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withAgentUsageSelectFx } from "~/user/agent/server/db/withAgentUsageSelectFx";
import type { AgentUsageFilterSchema } from "~/user/agent/server/schema/AgentUsageFilterSchema";
import type { AgentUsageQuerySchema } from "~/user/agent/server/schema/AgentUsageQuerySchema";

export namespace agentUsageDeleteCollectionFx {
	export interface Props extends AgentUsageQuerySchema.Type {
		scope: AgentUsageFilterSchema.Type;
	}
}

export const agentUsageDeleteCollectionFx = Effect.fn("agentUsageDeleteCollectionFx")(function* (
	query: agentUsageDeleteCollectionFx.Props,
) {
	const logger = yield* getLoggerFx("agentUsageDeleteCollectionFx");
	logger.trace("agentUsageDeleteCollectionFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			let { select, queryFx } = yield* withAgentUsageSelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.filter,
				query.where,
				query.scope,
			]) {
				select = yield* queryFx(select, layer);
			}

			return yield* dbFx(async (kysely) => {
				const { numDeletedRows } = await kysely
					.deleteFrom("agent_usage")
					.where("id", "in", select.clearSelect().select("au.id"))
					.executeTakeFirstOrThrow();

				return Number(numDeletedRows);
			});
		}),
	);
});

export type agentUsageDeleteCollectionFx = ReturnType<typeof agentUsageDeleteCollectionFx>;
