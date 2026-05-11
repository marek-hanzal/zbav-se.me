import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { selectFx } from "@/lib/common/select";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withNormalizedContainsEx } from "~/server/database/expression/withNormalizedContainsEx";
import { withNormalizedLikeEx } from "~/server/database/expression/withNormalizedLikeEx";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { withUserRestrictionActiveSelectFx } from "~/user/user-restriction/server/db/withUserRestrictionActiveSelectFx";
import type { ListingMetaSchema } from "../schema/ListingMetaSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
	const { kysely } = yield* KyselyContextFx;
	const logger = yield* getLoggerFx("withListingSelectFx", "buyer");

	const fallbackSql = sql<RestrictionEnumSchema.Type>`${RestrictionEnumSchema.enum.none}::restriction_enum`;
	const restrictionSql = yield* withUserRestrictionActiveSelectFx({
		userId,
	});

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		])
		.where((eb) => {
			return eb(
				eb.fn.coalesce(
					sql<RestrictionEnumSchema.Type | null>`
						greatest(
							${eb.ref("cat.restriction")},
							${eb.ref("l.restriction")}
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

				return select.orderBy((eb) => {
					const origin = eb
						.selectFrom("location as originLoc")
						.select((eb) => {
							if (!isDesc) {
								return sql`
									ST_SetSRID(
										ST_MakePoint(
											${eb.ref("originLoc.lon")},
											${eb.ref("originLoc.lat")}
										),
										4326
									)
								`.as("point");
							}

							return sql`
								ST_SetSRID(
									ST_MakePoint(
										case
											when ${eb.ref("originLoc.lon")} >= 0 then ${eb.ref("originLoc.lon")} - 180
											else ${eb.ref("originLoc.lon")} + 180
										end,
										-${eb.ref("originLoc.lat")}
									),
									4326
								)
							`.as("point");
						})
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`${eb.ref("l.withLocation")} <-> (${origin})`;
				}, sortOrder);
			})
			.exhaustive();
	}

	return selectFx({
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

				(eb) => {
					return eb
						.selectFrom("location as loc")
						.select((eb) => {
							return sql<LocationSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as(
								"json",
							);
						})
						.whereRef("loc.id", "=", "l.locationId")
						.limit(1)
						.$asScalar()
						.$castTo<LocationSchema.Type>()
						.as("location");
				},

				(eb) => {
					return sql<CategorySchema.Type>`
						to_jsonb(${eb.table("cat")}.*)
						|| jsonb_build_object(
							'isRestricted',
							${eb.ref("cat.restriction")} > ${restrictionSql}
						)
					`.as("category");
				},

				(eb) => {
					if (!locationId) {
						return eb.lit(null).as("distance");
					}

					const originGeoSelect = eb
						.selectFrom("location as originLoc")
						.select("originLoc.geo")
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`
                            ST_Distance(
                                ${eb.ref("l.withLocation")},
                                ${originGeoSelect}
                            ) / 1000
                        `
						.$castTo<number>()
						.as("distance");
				},

				(eb) => {
					return sql<string[]>`to_jsonb(${eb.ref("l.pros")})`.as("pros");
				},

				(eb) => {
					return sql<string[]>`to_jsonb(${eb.ref("l.cons")})`.as("cons");
				},

				(eb) => {
					return sql<DeliveryEnumSchema.Type[]>`to_jsonb(${eb.ref("l.delivery")})`.as(
						"delivery",
					);
				},
			])
			.select((eb) => {
				return sql<RestrictionEnumSchema.Type>`
							greatest(
								${eb.ref("cat.restriction")},
								${eb.ref("l.restriction")}
							)
						`.as("withRestriction");
			})
			.select((eb) => {
				return eb("l.userId", "=", userId).$castTo<boolean>().as("my");
			})
			.select((eb) => [
				eb
					.exists(
						eb
							.selectFrom("favourite as f")
							.select(sql`1`.as("true"))
							.whereRef("f.listingId", "=", "l.id")
							.where("f.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("isFavourite"),

				eb
					.exists(
						eb
							.selectFrom("ignore as i")
							.select(sql`1`.as("true"))
							.whereRef("i.listingId", "=", "l.id")
							.where("i.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("isIgnored"),

				eb
					.exists(
						eb
							.selectFrom("flag as f")
							.select(sql`1`.as("true"))
							.whereRef("f.listingId", "=", "l.id")
							.where("f.userId", "=", userId),
					)
					.$castTo<boolean>()
					.as("hasFlag"),

				eb
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

				eb
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

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				if (where.ageIn && where.ageIn.length > 0) {
					query = query.where("l.age", "in", where.ageIn);
				}

				if (where.conditionIn && where.conditionIn.length > 0) {
					query = query.where("l.condition", "in", where.conditionIn);
				}

				if (where.deliveryIn && where.deliveryIn.length > 0) {
					query = query.where((eb) => {
						return sql`${eb.ref("l.delivery")} && ${sql.val(where.deliveryIn)}::delivery_enum[]`;
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
					query = query.where((eb) => {
						return withNormalizedLikeEx(eb.ref("l.withTitle"), where.title, "both");
					});
				}

				if (locationId && where.range !== undefined) {
					const range = where.range * 1_000;

					query = query.where((eb) => {
						const origin = eb
							.selectFrom("location as originLoc")
							.select("originLoc.geo")
							.where("originLoc.id", "=", locationId)
							.limit(1);

						return sql`ST_DWithin(
							${eb.ref("l.withLocation")},
							${origin},
							${eb.val(range)}
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
					query = query.where(({ not, exists, selectFrom }) => {
						return not(
							exists(
								selectFrom("ignore as i")
									.select("i.listingId")
									.whereRef("i.listingId", "=", "l.id")
									.where("i.userId", "=", userId),
							),
						);
					});
				}

				if (where.isFavourite === true) {
					query = query.where(({ exists, selectFrom }) => {
						return exists(
							selectFrom("favourite as f")
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
									return query.where(({ exists, selectFrom }) => {
										let select = selectFrom("listing_attr_decimal as lad")
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

										return exists(select);
									});
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
									return query.where(({ exists, selectFrom }) => {
										let select = selectFrom("listing_attr_number as lan")
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

										return exists(select);
									});
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

									return query.where(({ exists, selectFrom }) => {
										return exists(
											selectFrom("listing_attr_enum_single as laes")
												.select("laes.listingId")
												.whereRef("laes.listingId", "=", "l.id")
												.where("laes.fieldId", "=", name)
												.where("laes.value", "=", value),
										);
									});
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

									return query.where(({ exists, selectFrom }) => {
										return exists(
											selectFrom("listing_attr_enum_multi as laem")
												.select("laem.listingId")
												.whereRef("laem.listingId", "=", "l.id")
												.where("laem.fieldId", "=", name)
												.where("laem.value", "in", value),
										);
									});
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
