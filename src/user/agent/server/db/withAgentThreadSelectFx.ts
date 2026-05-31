import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AgentThreadSortSchema } from "../schema/AgentThreadSortSchema";
import type { AgentThreadWhereSchema } from "../schema/AgentThreadWhereSchema";

export namespace withAgentThreadSelectFx {
	export interface Props {
		sort?: AgentThreadSortSchema.Type[];
	}
}

export const withAgentThreadSelectFx = Effect.fn("withAgentThreadSelectFx")(function* ({
	sort,
}: withAgentThreadSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("agent_thread as at");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("at.createdAt", item.order))
			.with("updatedAt", () => select.orderBy("at.updatedAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: select.selectAll("at"),
		queryFx(select, where: AgentThreadWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("at.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("at.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("at.userId", "=", where.userId);
				}

				if (where.archivedAt) {
					query = match(where.archivedAt)
						.with("archived", () => query.where("at.archivedAt", "is not", null))
						.with("active", () => query.where("at.archivedAt", "is", null))
						.with("any", () => query)
						.exhaustive();
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
