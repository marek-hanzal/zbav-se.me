import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { UserEventFilterSchema } from "../schema/UserEventFilterSchema";
import type { UserEventSortSchema } from "../schema/UserEventSortSchema";

export namespace withUserEventSelectFx {
	export interface Props {
		sort?: UserEventSortSchema.Type[];
	}
}

export const withUserEventSelectFx = Effect.fn("withUserEventSelectFx")(function* ({
	sort,
}: withUserEventSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("user_event as ue").selectAll("ue");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("ue.createdAt", item.order))
			.with("group", () => select.orderBy("ue.group", item.order))
			.with("id", () => select.orderBy("ue.id", item.order))
			.exhaustive();
	}

	return selectFx({
		select,
		queryFx(select, where: UserEventFilterSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("ue.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("ue.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("ue.userId", "=", where.userId);
				}

				if (where.scope) {
					query = query.where("ue.scope", "=", where.scope);
				}

				if (where.source) {
					query = query.where("ue.source", "=", where.source);
				}

				if (where.group) {
					query = query.where("ue.group", "=", where.group);
				}

				if (where.event) {
					query = query.where("ue.event", "=", where.event);
				}

				if (where.isTerminal !== undefined) {
					query = query.where("ue.isTerminal", "=", where.isTerminal);
				}

				if (where.cutoff !== undefined) {
					query = query.where(
						"ue.createdAt",
						">=",
						sql<Date>`now() - make_interval(days => ${where.cutoff})`,
					);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
