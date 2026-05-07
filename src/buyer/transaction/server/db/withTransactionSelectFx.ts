import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import type { TransactionFilterSchema } from "../schema/TransactionFilterSchema";
import type { TransactionSortSchema } from "../schema/TransactionSortSchema";

export namespace withTransactionSelectFx {
	export interface Props {
		sort?: TransactionSortSchema.Type[];
	}
}

export const withTransactionSelectFx = Effect.fn("withTransactionSelectFx")(function* ({
	sort,
}: withTransactionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const archivedStatuses = [
		"sold",
		"rejected",
		"expired",
		"success",
		"closed",
	] satisfies TransactionStatusEnumSchema.Type[];

	let query = kysely
		.selectFrom("transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.order))
			.with("lastAt", () => {
				return query.orderBy(
					(eb) =>
						eb.fn.coalesce(
							eb
								.selectFrom("transaction_entry as te")
								.select("te.createdAt")
								.whereRef("te.transactionId", "=", "lt.id")
								.orderBy("te.createdAt", "desc")
								.limit(1)
								.$asScalar(),
							eb.ref("lt.updatedAt"),
						),
					item.order,
				);
			})
			.with("status", () => {
				return query.orderBy(
					(eb) =>
						eb
							.case(eb.ref("lt.status"))
							.when("interest")
							.then(10)
							.when("trade")
							.then(20)
							.when("resolved")
							.then(30)
							.when("dispute")
							.then(40)
							.when("rejected")
							.then(50)
							.when("sold")
							.then(60)
							.when("expired")
							.then(70)
							.when("success")
							.then(80)
							.when("closed")
							.then(90)
							.else(999)
							.end(),
					item.order,
				);
			})
			.exhaustive();
	}

	return selectFx({
		select: query
			.selectAll("lt")
			.select("l.withImageUrl")
			.select("l.title")
			.select((eb) => {
				const lastActivitySelect = eb
					.selectFrom("transaction_entry as te")
					.whereRef("te.transactionId", "=", "lt.id")
					.orderBy("te.createdAt", "desc")
					.limit(1);

				return [
					eb.fn
						.coalesce(
							lastActivitySelect.select("te.createdAt").$asScalar(),
							eb.ref("lt.updatedAt"),
						)
						.as("lastAt"),
					jsonObjectFrom(
						lastActivitySelect
							.selectAll("te")
							.select(eb.ref("l.id").as("listingId"))
							.select((eb) => {
								return eb
									.case()
									.when("te.userId", "is", null)
									.then(TransactionEntryDirectionEnumSchema.enum.system)
									.when("te.userId", "=", eb.ref("lt.userId"))
									.then(TransactionEntryDirectionEnumSchema.enum.out)
									.else(TransactionEntryDirectionEnumSchema.enum.in)
									.end()
									.as("direction");
							}),
					)
						.$notNull()
						.$castTo<TransactionEntrySchema.Type>()
						.as("entry"),
					eb.fn
						.coalesce(
							eb
								.selectFrom("activity as i")
								.select(sql<number>`count(*)::int`.as("unread"))
								.whereRef("i.userId", "=", "lt.userId")
								.where("i.family", "=", "transaction")
								.where("i.type", "=", "seller-message")
								.where("i.archivedAt", "is", null)
								.where((eb) => {
									return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
								}),
							sql.lit(0),
						)
						.as("unread"),
					eb.ref("lt.status").$notNull().as("status"),
				];
			}),
		queryFx(select, where: TransactionFilterSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("lt.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("lt.id", "in", where.idIn);
				}

				if (where.userId) {
					const userId = where.userId;
					query = query.where("lt.userId", "=", userId);
				}

				if (where.listingId) {
					query = query.where("lt.listingId", "=", where.listingId);
				}

				if (where.flow) {
					const flow = where.flow;

					if (flow === "seller-to-buyer") {
						query = query.where((eb) => {
							return eb.exists(
								eb
									.selectFrom("activity as i")
									.select("i.id")
									.whereRef("i.userId", "=", "lt.userId")
									.where("i.family", "=", "transaction")
									.where("i.type", "=", "seller-message")
									.where("i.archivedAt", "is", null)
									.where((eb) => {
										return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
									}),
							);
						});
					} else if (flow === "buyer-to-seller") {
						query = query.where((eb) =>
							eb.and([
								eb("lt.status", "in", [
									"trade",
									"interest",
									"dispute",
								]),
								eb.not(
									eb.exists(
										eb
											.selectFrom("activity as i")
											.select("i.id")
											.whereRef("i.userId", "=", "lt.userId")
											.where("i.family", "=", "transaction")
											.where("i.type", "=", "seller-message")
											.where("i.archivedAt", "is", null)
											.where((eb) => {
												return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
											}),
									),
								),
							]),
						);
					} else if (flow === "archived") {
						query = query.where("lt.status", "in", archivedStatuses);
					}
				}

				if (where.activity) {
					const activity = where.activity;

					if (activity === "unread") {
						query = query.where((eb) => {
							return eb.exists(
								eb
									.selectFrom("activity as i")
									.select("i.id")
									.whereRef("i.userId", "=", "lt.userId")
									.where("i.family", "=", "transaction")
									.where("i.type", "=", "seller-message")
									.where("i.archivedAt", "is", null)
									.where((eb) => {
										return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
									}),
							);
						});
					} else if (activity === "archived") {
						query = query.where((eb) => {
							return eb.not(
								eb.exists(
									eb
										.selectFrom("activity as i")
										.select("i.id")
										.whereRef("i.userId", "=", "lt.userId")
										.where("i.family", "=", "transaction")
										.where("i.type", "=", "seller-message")
										.where("i.archivedAt", "is", null)
										.where((eb) => {
											return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
										}),
								),
							);
						});
					}
				}

				if (where.status) {
					query = query.where("lt.status", "=", where.status);
				}

				if (where.statusIn && where.statusIn.length > 0) {
					query = query.where("lt.status", "in", where.statusIn);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
