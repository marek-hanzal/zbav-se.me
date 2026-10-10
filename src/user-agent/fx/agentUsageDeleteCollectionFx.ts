import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withAgentUsageSelectFx } from "~/user-agent/db/withAgentUsageSelectFx";
import type { AgentUsageQuerySchema } from "~/user-agent/schema/AgentUsageQuerySchema";
import type { AgentUsageWhereSchema } from "~/user-agent/schema/AgentUsageWhereSchema";

export namespace agentUsageDeleteCollectionFx {
	export interface Props extends AgentUsageQuerySchema.Type {
		scope: AgentUsageWhereSchema.Type;
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
