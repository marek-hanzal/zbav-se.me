import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withAgentStreamSelectFx } from "~/user/agent/server/db/withAgentStreamSelectFx";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";
import type { AgentStreamWhereSchema } from "../schema/AgentStreamWhereSchema";

export namespace agentStreamDeleteCollectionFx {
	export interface Props extends AgentStreamQuerySchema.Type {
		scope: AgentStreamWhereSchema.Type;
	}
}

export const agentStreamDeleteCollectionFx = Effect.fn("agentStreamDeleteCollectionFx")(function* (
	query: agentStreamDeleteCollectionFx.Props,
) {
	const logger = yield* getLoggerFx("agentStreamDeleteCollectionFx");
	logger.trace("agentStreamDeleteCollectionFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			let { select, queryFx } = yield* withAgentStreamSelectFx({
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
					.deleteFrom("agent_stream")
					.where("id", "in", select.clearSelect().select("as.id"))
					.executeTakeFirstOrThrow();

				return Number(numDeletedRows);
			});
		}),
	);
});

export type agentStreamDeleteCollectionFx = ReturnType<typeof agentStreamDeleteCollectionFx>;
