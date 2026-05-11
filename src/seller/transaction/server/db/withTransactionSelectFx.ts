import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
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

	let select = kysely
		.selectFrom("transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("lt.createdAt", item.order))
			.with("updatedAt", () => select.orderBy("lt.updatedAt", item.order))
			.with("expiresAt", () => select.orderBy("lt.expiresAt", item.order))
			.with("lastAt", () => {
				return select.orderBy((eb) => {
					return eb.fn.coalesce(
						eb
							.selectFrom("transaction_entry as te")
							.select("te.createdAt")
							.whereRef("te.transactionId", "=", "lt.id")
							.where((eb) => {
								return eb.or([
									eb("te.kind", "!=", "text"),
									eb("lt.status", "!=", "interest"),
								]);
							})
							.orderBy("te.createdAt", "desc")
							.limit(1)
							.$asScalar(),
						eb.ref("lt.updatedAt"),
					);
				}, item.order);
			})
			.with("status", () => {
				return select.orderBy((eb) => {
					return eb
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
						.end();
				}, item.order);
			})
			.exhaustive();
	}

	return selectFx({
		select: select
			.selectAll("lt")
			.select([
				"l.title",
				"l.withImageUrl",
				"l.price",
				"l.priceType",
				"l.currency",
			])
			.select((eb) => {
				/**
				 * Pick the latest seller-visible timeline entry for seller transaction previews.
				 *
				 * Buyer text written in `interest` belongs to the buyer-side buffer and must not
				 * appear in seller list/detail previews before the seller opens the trade. This
				 * keeps the preview aligned with the main transaction-entry visibility gate while
				 * still allowing non-text status entries to explain the current state.
				 */
				const lastActivitySelect = eb
					.selectFrom("transaction_entry as te")
					.whereRef("te.transactionId", "=", "lt.id")
					.where((eb) => {
						return eb.or([
							eb("te.kind", "!=", "text"),
							eb("lt.status", "!=", "interest"),
						]);
					})
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
							.select("l.id as listingId")
							.select((eb) => {
								return sql<TransactionEntryDirectionEnumSchema.Type>`case
									when ${eb.ref("te.userId")} is null then ${TransactionEntryDirectionEnumSchema.enum.system}
									when ${eb.ref("te.userId")} = ${eb.ref("l.userId")} then ${TransactionEntryDirectionEnumSchema.enum.out}
									else ${TransactionEntryDirectionEnumSchema.enum.in}
								end`.as("direction");
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
								.whereRef("i.userId", "=", "l.userId")
								.where("i.family", "=", "transaction")
								.where("i.type", "=", "buyer-message")
								.where("i.archivedAt", "is", null)
								.where((eb) => {
									return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
								}),
							eb.lit(0),
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
					query = query.where("l.userId", "=", where.userId);
				}

				if (where.listingId) {
					query = query.where("lt.listingId", "=", where.listingId);
				}

				if (where.activity) {
					const activity = where.activity;

					if (activity === "unread") {
						query = query.where((eb) => {
							return eb.exists(
								eb
									.selectFrom("activity as i")
									.select("i.id")
									.whereRef("i.userId", "=", "l.userId")
									.where("i.family", "=", "transaction")
									.where("i.type", "=", "buyer-message")
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
										.whereRef("i.userId", "=", "l.userId")
										.where("i.family", "=", "transaction")
										.where("i.type", "=", "buyer-message")
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
