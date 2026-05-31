import { Effect } from "effect";
import { match } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AgentStreamSortSchema } from "../schema/AgentStreamSortSchema";
import type { AgentStreamWhereSchema } from "../schema/AgentStreamWhereSchema";

export namespace withAgentStreamSelectFx {
	export interface Props {
		sort?: AgentStreamSortSchema.Type[];
	}
}

export const withAgentStreamSelectFx = Effect.fn("withAgentStreamSelectFx")(function* ({
	sort,
}: withAgentStreamSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("agent_stream as as");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("sort", () => select.orderBy("as.sort", item.order))
			.exhaustive();
	}

	return selectFx({
		select: select.select([
			"as.id",
			"as.userId",
			"as.threadId",
			"as.payload",
			"as.sort",
		]),
		queryFx(select, where: AgentStreamWhereSchema.Type) {
			return Effect.gen(function* () {
				const logger = yield* getLoggerFx("withAgentStreamQueryBuilderFx");
				logger.trace("withAgentStreamQueryBuilderFx", {
					where,
				});

				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("as.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("as.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("as.userId", "=", where.userId);
				}

				if (where.threadId) {
					query = query.where("as.threadId", "=", where.threadId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
