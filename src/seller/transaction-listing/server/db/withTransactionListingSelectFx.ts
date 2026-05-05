import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import type { TransactionListingFilterSchema } from "../schema/TransactionListingFilterSchema";
import type { TransactionListingSortSchema } from "../schema/TransactionListingSortSchema";

export namespace withTransactionListingSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}
}

export const withTransactionListingSelectFx = Effect.fn("withTransactionListingSelectFx")(
	function* ({ sort }: withTransactionListingSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;

		let select = kysely
			.selectFrom("listing as l")
			.select([
				"l.id as listingId",
				"l.id",
				"l.withImageUrl",
				(eb) => {
					return eb
						.selectFrom("transaction as lt")
						.select(sql<number>`count(*)::int`.as("count"))
						.whereRef("lt.listingId", "=", "l.id")
						.$asScalar()
						.$castTo<number>()
						.as("count");
				},
				(eb) => {
					return eb.fn
						.coalesce(
							eb
								.selectFrom("activity as i")
								.select((eb) => {
									return sql<number>`count(distinct ${eb.ref("i.payload")} ->> 'transactionId')::int`.as(
										"unread",
									);
								})
								.whereRef("i.userId", "=", "l.userId")
								.where("i.family", "=", "transaction")
								.where("i.type", "=", "buyer-message")
								.where("i.archivedAt", "is", null)
								.where((eb) => {
									return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`;
								}),
							eb.lit(0),
						)
						.as("unread");
				},
			])
			.select((eb) => {
				const activitySql = eb
					.selectFrom("transaction_entry as te")
					.innerJoin("transaction as lt", "lt.id", "te.transactionId")
					.whereRef("lt.listingId", "=", "l.id")
					.where((eb) => {
						return eb.or([
							eb("te.kind", "!=", "text"),
							eb("lt.status", "!=", "interest"),
						]);
					})
					.orderBy("te.createdAt", "desc")
					.limit(1);

				return [
					jsonObjectFrom(
						activitySql.selectAll("te").select((eb) => {
							return eb
								.case()
								.when("te.userId", "is", null)
								.then(TransactionEntryDirectionEnumSchema.enum.system)
								.when("te.userId", "=", eb.ref("l.userId"))
								.then(TransactionEntryDirectionEnumSchema.enum.out)
								.else(TransactionEntryDirectionEnumSchema.enum.in)
								.end()
								.as("direction");
						}),
					)
						.$notNull()
						.$castTo<TransactionEntrySchema.Type>()
						.as("entry"),
					activitySql.select("te.createdAt").$asScalar().$notNull().as("lastAt"),
				];
			})
			.where(({ exists, selectFrom }) => {
				return exists(
					selectFrom("transaction as lt")
						.select("lt.id")
						.whereRef("lt.listingId", "=", "l.id"),
				);
			});

		for (const item of sort ?? []) {
			select = match(item.field)
				.with("createdAt", () => select.orderBy("l.createdAt", item.order))
				.with("lastAt", () => select.orderBy("lastAt", item.order))
				.exhaustive();
		}

		return selectFx({
			select,
			queryFx(select, where: TransactionListingFilterSchema.Type) {
				return Effect.gen(function* () {
					let query = select;

					if (!where) {
						return yield* Effect.succeed(select);
					}

					if (where.id) {
						query = query.where("l.id", "=", where.id);
					}

					if (where.idIn && where.idIn.length > 0) {
						query = query.where("l.id", "in", where.idIn);
					}

					if (where.fulltext) {
						const _fulltext = where.fulltext;
						// fulltext search (commented out in original) could be added here if needed
					}

					if (where.userId) {
						query = query.where("l.userId", "=", where.userId);
					}

					if (where.flow) {
						const flow = where.flow;

						if (flow === "buyer-to-seller") {
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
											return sql`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`;
										}),
								);
							});
						} else if (flow === "seller-to-buyer") {
							query = query.where((eb) =>
								eb.and([
									eb.exists(
										eb
											.selectFrom("transaction as lt")
											.select("lt.id")
											.whereRef("lt.listingId", "=", "l.id")
											.where("lt.status", "in", [
												"trade",
												"dispute",
												"resolved",
											]),
									),
									eb.not(
										eb.exists(
											eb
												.selectFrom("activity as i")
												.select("i.id")
												.whereRef("i.userId", "=", "l.userId")
												.where("i.family", "=", "transaction")
												.where("i.type", "=", "buyer-message")
												.where("i.archivedAt", "is", null)
												.where((eb) => {
													return sql`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`;
												}),
										),
									),
								]),
							);
						}
					}

					return yield* Effect.succeed(query);
				});
			},
		});
	},
);
