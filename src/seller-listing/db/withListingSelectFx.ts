import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withNormalizedContainsExFn } from "~/database/fn/withNormalizedContainsExFn";
import { selectFn } from "~/database-query/fn/selectFn";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import type { ListingSortSchema } from "~/seller-listing/schema/ListingSortSchema";
import type { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import type { CategorySchema } from "~/user-category/schema/CategorySchema";
import { withUserRestrictionActiveSelectFx } from "~/user-restriction/db/withUserRestrictionActiveSelectFx";
import type { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";
import { TransactionEntryDirectionEnumSchema } from "~/user-transaction-entry/schema/TransactionEntryDirectionEnumSchema";

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
		.select((ebFn) => {
			return ebFn
				.selectFrom("location as loc")
				.select((ebFn) => {
					return sql<LocationSchema.Type>`to_jsonb(${ebFn.table("loc")}.*)`.as("json");
				})
				.whereRef("loc.id", "=", "l.locationId")
				.limit(1)
				.$castTo<LocationSchema.Type>()
				.as("location");
		})
		.select((ebFn) => {
			return ebFn
				.selectFrom("transaction as lt")
				.select(sql<number>`count(*)::int`.as("count"))
				.whereRef("lt.listingId", "=", "l.id")
				.$asScalar()
				.$castTo<number>()
				.as("withTransactionCount");
		})
		.select((ebFn) => {
			return ebFn.fn
				.coalesce(
					ebFn
						.selectFrom("activity as i")
						.select((ebFn) => {
							return sql<number>`count(distinct ${ebFn.ref("i.payload")} ->> 'transactionId')::int`.as(
								"unread",
							);
						})
						.whereRef("i.userId", "=", "l.userId")
						.where("i.family", "=", "transaction")
						.where("i.type", "=", "buyer-message")
						.where("i.archivedAt", "is", null)
						.where((ebFn) => {
							return sql<boolean>`${ebFn.ref("i.reference")} @> ARRAY[${ebFn.ref("l.id")}]::text[]`;
						}),
					ebFn.lit(0),
				)
				.as("withUnreadCount");
		})
		.select((ebFn) => {
			const activitySql = ebFn
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.whereRef("lt.listingId", "=", "l.id")
				.where((ebFn) => {
					return ebFn.or([
						ebFn("te.kind", "!=", "text"),
						ebFn("lt.status", "!=", "interest"),
					]);
				})
				.orderBy("te.createdAt", "desc")
				.limit(1);

			return [
				jsonObjectFrom(
					activitySql
						.selectAll("te")
						.select("lt.listingId as listingId")
						.select((ebFn) => {
							return ebFn
								.case()
								.when("te.userId", "is", null)
								.then(TransactionEntryDirectionEnumSchema.enum.system)
								.when("te.userId", "=", ebFn.ref("l.userId"))
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
		.select((ebFn) => {
			return sql<CategorySchema.Type>`
                    to_jsonb(${ebFn.table("cat")}.*)
                    || jsonb_build_object(
                        'isRestricted',
                        ${ebFn.ref("cat.restriction")} > ${restrictionSql}
                    )
                `.as("category");
		})
		.select((ebFn) => {
			return sql<string[]>`to_jsonb(${ebFn.ref("l.pros")})`.as("pros");
		})
		.select((ebFn) => {
			return sql<string[]>`to_jsonb(${ebFn.ref("l.cons")})`.as("cons");
		})
		.select((ebFn) => {
			return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${ebFn.ref("l.delivery")})`.as(
				"delivery",
			);
		})
		.select((ebFn) => {
			return ebFn.fn
				.coalesce(
					sql<RestrictionEnumSchema.Type | null>`
                            greatest(
                                ${ebFn.ref("cat.restriction")},
                                ${ebFn.ref("l.restriction")}
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

	return selectFn({
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

					query = query.where((ebFn) => {
						return ebFn.and(
							fulltext.map((term) =>
								ebFn.exists(
									ebFn
										.selectFrom("listing_spotlight as ls")
										.select("ls.listingId")
										.whereRef("ls.listingId", "=", "l.id")
										.where((ebFn) => {
											return withNormalizedContainsExFn(
												ebFn.ref("ls.text"),
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
					query = query.where(({ exists: existsFn, selectFrom: selectFromFn }) => {
						return existsFn(
							selectFromFn("transaction as lt")
								.select("lt.id")
								.whereRef("lt.listingId", "=", "l.id"),
						);
					});
				}

				if (where.flow) {
					const flow = where.flow;

					if (flow === "buyer-to-seller") {
						query = query.where((ebFn) => {
							return ebFn.exists(
								ebFn
									.selectFrom("activity as i")
									.select("i.id")
									.whereRef("i.userId", "=", "l.userId")
									.where("i.family", "=", "transaction")
									.where("i.type", "=", "buyer-message")
									.where("i.archivedAt", "is", null)
									.where((ebFn) => {
										return sql`${ebFn.ref("i.reference")} @> ARRAY[${ebFn.ref("l.id")}]::text[]`;
									}),
							);
						});
					} else if (flow === "seller-to-buyer") {
						query = query.where((ebFn) =>
							ebFn.and([
								ebFn.exists(
									ebFn
										.selectFrom("transaction as lt")
										.select("lt.id")
										.whereRef("lt.listingId", "=", "l.id")
										.where("lt.status", "in", [
											"trade",
											"dispute",
											"resolved",
										]),
								),
								ebFn.not(
									ebFn.exists(
										ebFn
											.selectFrom("activity as i")
											.select("i.id")
											.whereRef("i.userId", "=", "l.userId")
											.where("i.family", "=", "transaction")
											.where("i.type", "=", "buyer-message")
											.where("i.archivedAt", "is", null)
											.where((ebFn) => {
												return sql`${ebFn.ref("i.reference")} @> ARRAY[${ebFn.ref("l.id")}]::text[]`;
											}),
									),
								),
							]),
						);
					} else if (flow === "archived") {
						query = query.where((ebFn) => {
							return ebFn.exists(
								ebFn
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
