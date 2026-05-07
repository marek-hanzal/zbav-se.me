import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ActivitySortSchema } from "~/user/activity/server/schema/ActivitySortSchema";
import type { ActivityFilterSchema } from "../schema/ActivityFilterSchema";

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
		.where((eb) => {
			return eb.or([
				eb("i.type", "not in", deduplicatedMessageTypes),
				eb.not(
					eb.exists(
						eb
							.selectFrom("activity as newer")
							.select("newer.id")
							.whereRef("newer.userId", "=", "i.userId")
							.whereRef("newer.family", "=", "i.family")
							.whereRef("newer.type", "=", "i.type")
							.where((eb) => {
								return sql<boolean>`${eb.ref("newer.payload")} ->> 'transactionId' = ${eb.ref("i.payload")} ->> 'transactionId'`;
							})
							.where((eb) => {
								const newerIsMoreRecent = eb.or([
									eb("newer.timestamp", ">", eb.ref("i.timestamp")),
									eb.and([
										eb("newer.timestamp", "=", eb.ref("i.timestamp")),
										eb("newer.id", ">", eb.ref("i.id")),
									]),
								]);

								return eb.or([
									eb.and([
										eb("i.archivedAt", "is", null),
										eb("newer.archivedAt", "is", null),
										newerIsMoreRecent,
									]),
									eb.and([
										eb("i.archivedAt", "is not", null),
										eb.or([
											eb("newer.archivedAt", "is", null),
											eb.and([
												eb("newer.archivedAt", "is not", null),
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

	return selectFx({
		select,
		queryFx(select, where: ActivityFilterSchema.Type) {
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
					query = query.where((eb) => {
						return sql`${eb.ref("i.reference")} @> ARRAY[${where.reference}]::text[]`;
					});
				}

				if (where.referenceIn && where.referenceIn.length > 0) {
					const referenceIn = where.referenceIn;
					query = query.where((eb) => {
						return sql`${eb.ref("i.reference")} && ARRAY[${sql.join(referenceIn)}]::text[]`;
					});
				}

				if (where.referenceAllIn && where.referenceAllIn.length > 0) {
					const referenceAllIn = where.referenceAllIn;
					query = query.where((eb) => {
						return sql`${eb.ref("i.reference")} @> ARRAY[${sql.join(referenceAllIn)}]::text[]`;
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
