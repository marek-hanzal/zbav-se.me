import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { ActivityTableSchema } from "~/database/schema/ActivityTable";
import { selectFn } from "~/database-query/fn/selectFn";
import type { ActivitySortSchema } from "~/user-activity/schema/ActivitySortSchema";
import type { ActivityWhereSchema } from "~/user-activity/schema/ActivityWhereSchema";

export namespace withActivitySelectFx {
	export interface Props {
		sort?: ActivitySortSchema.Type[];
	}
}

export const withActivitySelectFx = Effect.fn("withActivitySelectFx")(function* ({
	sort,
}: withActivitySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const deduplicatedMessageTypes = [
		"buyer-message",
		"seller-message",
	] as const;

	let select = kysely
		.selectFrom("activity as i")
		.selectAll("i")
		.where((ebFn) => {
			return ebFn.or([
				ebFn("i.type", "not in", deduplicatedMessageTypes),
				ebFn.not(
					ebFn.exists(
						ebFn
							.selectFrom("activity as newer")
							.select("newer.id")
							.whereRef("newer.userId", "=", "i.userId")
							.whereRef("newer.family", "=", "i.family")
							.whereRef("newer.type", "=", "i.type")
							.where((ebFn) => {
								return sql<boolean>`${ebFn.ref("newer.payload")} ->> 'transactionId' = ${ebFn.ref("i.payload")} ->> 'transactionId'`;
							})
							.where((ebFn) => {
								const newerIsMoreRecent = ebFn.or([
									ebFn("newer.timestamp", ">", ebFn.ref("i.timestamp")),
									ebFn.and([
										ebFn("newer.timestamp", "=", ebFn.ref("i.timestamp")),
										ebFn("newer.id", ">", ebFn.ref("i.id")),
									]),
								]);

								return ebFn.or([
									ebFn.and([
										ebFn("i.archivedAt", "is", null),
										ebFn("newer.archivedAt", "is", null),
										newerIsMoreRecent,
									]),
									ebFn.and([
										ebFn("i.archivedAt", "is not", null),
										ebFn.or([
											ebFn("newer.archivedAt", "is", null),
											ebFn.and([
												ebFn("newer.archivedAt", "is not", null),
												newerIsMoreRecent,
											]),
										]),
									]),
								]);
							}),
					),
				),
			]);
		})
		.$castTo<ActivityTableSchema.Type>();

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("timestamp", () => select.orderBy("i.timestamp", item.order))
			.with("archivedAt", () => select.orderBy("i.archivedAt", item.order))
			.with("priority", () => select.orderBy("i.priority", item.order))
			.exhaustive();
	}

	return selectFn({
		select,
		queryFx(select, where: ActivityWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("i.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("i.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("i.userId", "=", where.userId);
				}

				if (where.reference) {
					query = query.where((ebFn) => {
						return sql`${ebFn.ref("i.reference")} @> ARRAY[${where.reference}]::text[]`;
					});
				}

				if (where.referenceIn && where.referenceIn.length > 0) {
					const referenceIn = where.referenceIn;
					query = query.where((ebFn) => {
						return sql`${ebFn.ref("i.reference")} && ARRAY[${sql.join(referenceIn)}]::text[]`;
					});
				}

				if (where.referenceAllIn && where.referenceAllIn.length > 0) {
					const referenceAllIn = where.referenceAllIn;
					query = query.where((ebFn) => {
						return sql`${ebFn.ref("i.reference")} @> ARRAY[${sql.join(referenceAllIn)}]::text[]`;
					});
				}

				if (where.family) {
					query = query.where("i.family", "=", where.family);
				}

				if (where.type) {
					query = query.where("i.type", "=", where.type);
				}

				if (where.priority) {
					query = query.where("i.priority", "=", where.priority);
				}

				if (where.archivedAtIsNull === true) {
					query = query.where("i.archivedAt", "is", null);
				}

				if (where.archivedAtIsNull === false) {
					query = query.where("i.archivedAt", "is not", null);
				}

				if (where.timestampGte) {
					query = query.where("i.timestamp", ">=", where.timestampGte);
				}

				if (where.timestampLte) {
					query = query.where("i.timestamp", "<=", where.timestampLte);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
