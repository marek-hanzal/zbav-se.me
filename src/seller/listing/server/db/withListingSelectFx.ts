import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withNormalizedContainsEx } from "~/server/database/expression/withNormalizedContainsEx";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";
import type { ListingSortSchema } from "../schema/ListingSortSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace withListingSelectFx {
	export interface Props {
		userId: string;
		sort?: ListingSortSchema.Type[];
	}
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	userId,
	sort,
}: withListingSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	let query = kysely
		.selectFrom("listing as l")
		.leftJoin("category as cat", "cat.id", "l.categoryId")
		.select([
			"l.id",
			"l.status",
			//
			"l.withUploadIds",
			"l.withImageUrl",
			//
			"l.title",
			"l.description",
			//
			"l.locationId",
			//
			"l.categoryId",
			"l.restriction",
			//
			"l.price",
			"l.currency",
			"l.priceType",
			//
			"l.expires",
			//
			"l.galleryId",
			"l.warranty",
			//
			"l.age",
			"l.condition",
			//
			"l.expiresAt",
			"l.createdAt",
			"l.updatedAt",
			"l.visibleAt",
		])
		.select((eb) => {
			return eb
				.selectFrom("location as loc")
				.select((eb) => {
					return sql<LocationSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("json");
				})
				.whereRef("loc.id", "=", "l.locationId")
				.limit(1)
				.$castTo<LocationSchema.Type>()
				.as("location");
		})
		.select((eb) => {
			return eb
				.selectFrom("transaction as lt")
				.select(sql<number>`count(*)::int`.as("count"))
				.whereRef("lt.listingId", "=", "l.id")
				.$asScalar()
				.$castTo<number>()
				.as("withTransactionCount");
		})
		.select((eb) => {
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
				.as("withUnreadCount");
		})
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
					activitySql
						.selectAll("te")
						.select("lt.listingId as listingId")
						.select((eb) => {
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
					.as("withTransactionEntry"),
				activitySql.select("te.createdAt").$asScalar().$notNull().as("withLastAt"),
			];
		})
		.select((eb) => {
			return sql<CategorySchema.Type>`
                    to_jsonb(${eb.table("cat")}.*)
                    || jsonb_build_object(
                        'isRestricted',
                        ${eb.ref("cat.restriction")} > ${restrictionSql}
                    )
                `.as("category");
		})
		.select((eb) => {
			return sql<string[]>`to_jsonb(${eb.ref("l.pros")})`.as("pros");
		})
		.select((eb) => {
			return sql<string[]>`to_jsonb(${eb.ref("l.cons")})`.as("cons");
		})
		.select((eb) => {
			return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${eb.ref("l.delivery")})`.as("delivery");
		})
		.select((eb) => {
			return eb.fn
				.coalesce(
					sql<RestrictionEnumSchema.Type | null>`
                            greatest(
                                ${eb.ref("cat.restriction")},
                                ${eb.ref("l.restriction")}
                            )
			            `,
					sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`,
				)
				.$castTo<RestrictionEnumSchema.Type>()
				.as("withRestriction");
		});

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.with("withLastAt", () => query.orderBy("withLastAt", item.order))
			.exhaustive();
	}

	query = query.orderBy("l.id", "desc");

	return selectFx({
		select: query,
		queryFx(select, where: ListingWhereSchema.Type) {
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

				if (where.fulltext?.length) {
					const fulltext = where.fulltext;

					query = query.where((eb) => {
						return eb.and(
							fulltext.map((term) =>
								eb.exists(
									eb
										.selectFrom("listing_spotlight as ls")
										.select("ls.listingId")
										.whereRef("ls.listingId", "=", "l.id")
										.where((eb) => {
											return withNormalizedContainsEx(
												eb.ref("ls.text"),
												term,
											);
										}),
								),
							),
						);
					});
				}

				if (where.userId) {
					query = query.where("l.userId", "=", where.userId);
				}

				if (where.status) {
					query = query.where("l.status", "=", where.status);
				}

				if (where.withTransaction) {
					query = query.where(({ exists, selectFrom }) => {
						return exists(
							selectFrom("transaction as lt")
								.select("lt.id")
								.whereRef("lt.listingId", "=", "l.id"),
						);
					});
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
					} else if (flow === "archived") {
						query = query.where((eb) => {
							return eb.exists(
								eb
									.selectFrom("transaction as lt")
									.select("lt.id")
									.whereRef("lt.listingId", "=", "l.id")
									.where("lt.status", "in", [
										"sold",
										"rejected",
										"expired",
										"success",
										"closed",
									]),
							);
						});
					}
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
