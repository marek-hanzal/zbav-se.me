import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFx } from "~/database-query/fx/selectFx";
import type { AgentUsageSortSchema } from "~/user-agent/schema/AgentUsageSortSchema";
import type { AgentUsageWhereSchema } from "~/user-agent/schema/AgentUsageWhereSchema";

export namespace withAgentUsageSelectFx {
	export interface Props {
		sort?: AgentUsageSortSchema.Type[];
	}
}

export const withAgentUsageSelectFx = Effect.fn("withAgentUsageSelectFx")(function* ({
	sort,
}: withAgentUsageSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("agent_usage as au");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("au.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.selectAll("au"),
		queryFx(select, where: AgentUsageWhereSchema.Type) {
			return Effect.gen(function* () {
				let q = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					q = q.where("au.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					q = q.where("au.id", "in", where.idIn);
				}

				if (where.userId) {
					q = q.where("au.userId", "=", where.userId);
				}

				if (where.threadId) {
					q = q.where("au.threadId", "=", where.threadId);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
