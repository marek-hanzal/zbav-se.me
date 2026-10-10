import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/buyer-listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/buyer-listing/schema/ListingSortSchema";
import type { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withNormalizedContainsExFn } from "~/database/fn/withNormalizedContainsExFn";
import { withNormalizedLikeExFn } from "~/database/fn/withNormalizedLikeExFn";
import { selectFn } from "~/database-query/fn/selectFn";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { ListingStatusEnumSchema } from "~/listing/schema/ListingStatusEnumSchema";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import type { CategorySchema } from "~/user-category/schema/CategorySchema";
import { withUserRestrictionActiveSelectFx } from "~/user-restriction/db/withUserRestrictionActiveSelectFx";

export namespace withListingSelectFx {
	export interface Props {
		userId: string;
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory: boolean | undefined;
	}
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	userId,
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const locationId = meta?.locationId;
	const dateService = yield* DateServiceFx;
	const { kysely } = yield* KyselyContextFx;
	const logger = yield* getLoggerFx("withListingSelectFx", "buyer");
	const now = dateService.nowFn().toJSDate();

	const fallbackSql = sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`;
	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "not in", [
			"on-hold",
			"banned",
		])
		.where((ebFn) => {
			return ebFn(
				ebFn.fn.coalesce(
					sql<RestrictionEnumSchema.Type | null>`
						greatest(
							${ebFn.ref("cat.restriction")},
							${ebFn.ref("l.restriction")}
						)
					`,
					fallbackSql,
				),
				"<=",
				restrictionSql,
			);
		});

	if (!hasExplicitCategory) {
		select = select.where("cat.discovery", "=", "implicit");
	}

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("price", () => select.orderBy("l.price", item.order))
			.with("condition", () => select.orderBy("l.condition", item.order))
			.with("age", () => select.orderBy("l.age", item.order))
			//
			.with("createdAt", () => select.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => select.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => select.orderBy("l.expiresAt", item.order))
			//
			.with("geo", () => {
				if (!locationId) {
					return select;
				}

				const isDesc = item.order === "desc";
				const sortOrder = isDesc ? "asc" : item.order;

				return select.orderBy((ebFn) => {
					const origin = ebFn
						.selectFrom("location as originLoc")
						.select((ebFn) => {
							if (!isDesc) {
								return sql`
									ST_SetSRID(
										ST_MakePoint(
											${ebFn.ref("originLoc.lon")},
											${ebFn.ref("originLoc.lat")}
										),
										4326
									)
								`.as("point");
							}

							return sql`
								ST_SetSRID(
									ST_MakePoint(
										case
											when ${ebFn.ref("originLoc.lon")} >= 0 then ${ebFn.ref("originLoc.lon")} - 180
											else ${ebFn.ref("originLoc.lon")} + 180
										end,
										-${ebFn.ref("originLoc.lat")}
									),
									4326
								)
							`.as("point");
						})
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`${ebFn.ref("l.withLocation")} <-> (${origin})`;
				}, sortOrder);
			})
			.exhaustive();
	}

	return selectFn({
		select: select
			.select([
				"l.id",
				"l.userId",
				"l.status",
				//
				"l.categoryId",
				//
				"l.locationId",
				"l.galleryId",
				//
				"l.title",
				//
				"l.withImageUrl",
				"l.withUploadIds",
				//
				"l.expires",
				//
				"l.price",
				"l.priceType",
				"l.currency",
				//
				"l.restriction",
				//
				"l.visibleAt",
				"l.expiresAt",
				"l.createdAt",
				"l.updatedAt",

				(ebFn) => {
					return ebFn
						.selectFrom("location as loc")
						.select((ebFn) => {
							return sql<LocationSchema.Type>`to_jsonb(${ebFn.table("loc")}.*)`.as(
								"json",
							);
						})
						.whereRef("loc.id", "=", "l.locationId")
						.limit(1)
						.$asScalar()
						.$castTo<LocationSchema.Type>()
						.as("location");
				},

				(ebFn) => {
					return sql<CategorySchema.Type>`
						to_jsonb(${ebFn.table("cat")}.*)
						|| jsonb_build_object(
							'isRestricted',
							${ebFn.ref("cat.restriction")} > ${restrictionSql}
						)
					`.as("category");
				},

				(ebFn) => {
					if (!locationId) {
						return ebFn.lit(null).as("distance");
					}

					const originGeoSelect = ebFn
						.selectFrom("location as originLoc")
						.select("originLoc.geo")
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`
                            ST_Distance(
                                ${ebFn.ref("l.withLocation")},
                                ${originGeoSelect}
                            ) / 1000
                        `
						.$castTo<number>()
						.as("distance");
				},

				(ebFn) => {
					return sql<string[]>`to_jsonb(${ebFn.ref("l.pros")})`.as("pros");
				},

				(ebFn) => {
					return sql<string[]>`to_jsonb(${ebFn.ref("l.cons")})`.as("cons");
				},

				(ebFn) => {
					return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${ebFn.ref("l.delivery")})`.as(
						"delivery",
					);
				},
			])
			.select((ebFn) => {
				return sql<RestrictionEnumSchema.Type>`
							greatest(
								${ebFn.ref("cat.restriction")},
								${ebFn.ref("l.restriction")}
							)
						`.as("withRestriction");
			})
			.select((ebFn) => {
				return ebFn("l.userId", "=", userId).$castTo<boolean>().as("my");
			})
			.select((ebFn) => [
				ebFn
					.exists(
						ebFn
							.selectFrom("listing_favourite as f")
							.select(sql`1`.as("true"))
							.whereRef("f.listingId", "=", "l.id")
							.where("f.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("isFavourite"),

				ebFn
					.exists(
						ebFn
							.selectFrom("listing_ignore as i")
							.select(sql`1`.as("true"))
							.whereRef("i.listingId", "=", "l.id")
							.where("i.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("isIgnored"),

				ebFn
					.exists(
						ebFn
							.selectFrom("listing_flag as f")
							.select(sql`1`.as("true"))
							.whereRef("f.listingId", "=", "l.id")
							.where("f.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("hasFlag"),

				ebFn
					.and([
						ebFn("l.status", "=", ListingStatusEnumSchema.enum.live),
						ebFn("l.expiresAt", ">", now),
					])
					.$castTo<boolean>()
					.as("isActive"),

				ebFn
					.selectFrom("transaction as lt")
					.select("lt.id")
					.whereRef("lt.listingId", "=", "l.id")
					.where("lt.userId", "=", userId)
					.where("lt.status", "in", [
						"interest",
						"trade",
						"rejected",
						"resolved",
						"success",
					])
					.orderBy("lt.statusUpdatedAt", "desc")
					.orderBy("lt.id", "desc")
					.limit(1)
					.as("transactionId"),

				ebFn
					.selectFrom("thumb as fb")
					.select("fb.type")
					.whereRef("fb.listingId", "=", "l.id")
					.where("fb.userId", "=", userId)
					.limit(1)
					.as("thumb"),
			]),
		queryFx(select, where: ListingWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(query);
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

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				if (where.statusIn && where.statusIn.length > 0) {
					query = query.where("l.status", "in", where.statusIn);
				}

				if (where.statusNotIn && where.statusNotIn.length > 0) {
					query = query.where("l.status", "not in", where.statusNotIn);
				}

				if (where.ageIn && where.ageIn.length > 0) {
					query = query.where("l.age", "in", where.ageIn);
				}

				if (where.conditionIn && where.conditionIn.length > 0) {
					query = query.where("l.condition", "in", where.conditionIn);
				}

				if (where.deliveryIn && where.deliveryIn.length > 0) {
					query = query.where((ebFn) => {
						return sql`${ebFn.ref("l.delivery")} && ${sql.val(where.deliveryIn)}::delivery_enum[]`;
					});
				}

				if (where.priceTypeIn && where.priceTypeIn.length > 0) {
					query = query.where("l.priceType", "in", where.priceTypeIn);
				}

				if (where.priceMin !== undefined) {
					query = query.where("l.price", ">=", where.priceMin);
				}

				if (where.priceMax !== undefined) {
					query = query.where("l.price", "<=", where.priceMax);
				}

				if (where.warrantyIn && where.warrantyIn.length > 0) {
					query = query.where("l.warranty", "in", where.warrantyIn);
				}

				if (where.title) {
					query = query.where((ebFn) => {
						return withNormalizedLikeExFn(ebFn.ref("l.withTitle"), where.title, "both");
					});
				}

				if (locationId && where.range !== undefined) {
					const range = where.range * 1_000;

					query = query.where((ebFn) => {
						const origin = ebFn
							.selectFrom("location as originLoc")
							.select("originLoc.geo")
							.where("originLoc.id", "=", locationId)
							.limit(1);

						return sql`ST_DWithin(
							${ebFn.ref("l.withLocation")},
							${origin},
							${ebFn.val(range)}
						)`;
					});
				}

				if (where.withOwn === false) {
					query = query.where("l.userId", "!=", userId);
				}

				if (where.my === true) {
					query = query.where("l.userId", "=", userId);
				}

				if (where.withIgnored === false) {
					query = query.where(
						({ not: notFn, exists: existsFn, selectFrom: selectFromFn }) => {
							return notFn(
								existsFn(
									selectFromFn("listing_ignore as i")
										.select("i.listingId")
										.whereRef("i.listingId", "=", "l.id")
										.where("i.userId", "=", userId),
								),
							);
						},
					);
				}

				if (where.isFavourite === true) {
					query = query.where(({ exists: existsFn, selectFrom: selectFromFn }) => {
						return existsFn(
							selectFromFn("listing_favourite as f")
								.select("f.listingId")
								.whereRef("f.listingId", "=", "l.id")
								.where("f.userId", "=", userId),
						);
					});
				}

				if (where.attrs) {
					const attrs = Object.values(where.attrs);

					for (const attr of attrs) {
						query = match(attr)
							.with(
								{
									type: "decimal",
								},
								{
									type: "range",
								},
								({ name, min, max, value }) => {
									return query.where(
										({ exists: existsFn, selectFrom: selectFromFn }) => {
											let select = selectFromFn("listing_attr_decimal as lad")
												.select("lad.listingId")
												.whereRef("lad.listingId", "=", "l.id")
												.where("lad.fieldId", "=", name);

											if (min != null) {
												select = select.where("lad.value", ">=", min);
											}

											if (max != null) {
												select = select.where("lad.value", "<=", max);
											}

											if (value != null) {
												select = select.where("lad.value", "=", value);
											}

											return existsFn(select);
										},
									);
								},
							)
							.with(
								{
									type: "number",
								},
								{
									type: "year",
								},
								({ name, min, max, value }) => {
									return query.where(
										({ exists: existsFn, selectFrom: selectFromFn }) => {
											let select = selectFromFn("listing_attr_number as lan")
												.select("lan.listingId")
												.whereRef("lan.listingId", "=", "l.id")
												.where("lan.fieldId", "=", name);

											if (min != null) {
												select = select.where("lan.value", ">=", min);
											}

											if (max != null) {
												select = select.where("lan.value", "<=", max);
											}

											if (value != null) {
												select = select.where("lan.value", "=", value);
											}

											return existsFn(select);
										},
									);
								},
							)
							.with(
								{
									type: "text",
								},
								() => {
									logger.warn(
										"Filtering extra field by text value (not supported yet)!",
									);

									return query;
								},
							)
							.with(
								{
									type: "enum-single",
								},
								({ name, value }) => {
									if (!value) {
										return query;
									}

									return query.where(
										({ exists: existsFn, selectFrom: selectFromFn }) => {
											return existsFn(
												selectFromFn("listing_attr_enum_single as laes")
													.select("laes.listingId")
													.whereRef("laes.listingId", "=", "l.id")
													.where("laes.fieldId", "=", name)
													.where("laes.value", "=", value),
											);
										},
									);
								},
							)
							.with(
								{
									type: "enum-multi",
								},
								({ name, value }) => {
									if (!value?.length) {
										return query;
									}

									return query.where(
										({ exists: existsFn, selectFrom: selectFromFn }) => {
											return existsFn(
												selectFromFn("listing_attr_enum_multi as laem")
													.select("laem.listingId")
													.whereRef("laem.listingId", "=", "l.id")
													.where("laem.fieldId", "=", name)
													.where("laem.value", "in", value),
											);
										},
									);
								},
							)
							.exhaustive();
					}
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
