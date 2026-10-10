import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withNormalizedContainsExFn } from "~/database/fn/withNormalizedContainsExFn";
import { selectFn } from "~/database-query/fn/selectFn";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { ListingStatusEnumSchema } from "~/listing/schema/ListingStatusEnumSchema";
import type { CategorySchema } from "~/public-category/schema/CategorySchema";
import type { ListingMetaSchema } from "~/public-listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/public-listing/schema/ListingSortSchema";
import type { ListingWhereSchema } from "~/public-listing/schema/ListingWhereSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";

const publicCategoryRestrictions = [
	RestrictionEnumSchema.enum.none,
	RestrictionEnumSchema.enum["adult-relaxed"],
] as const;

export namespace withListingSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta?: ListingMetaSchema.Type;
		hasExplicitCategory: boolean;
	}
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
	meta,
	hasExplicitCategory,
}: withListingSelectFx.Props) {
	const dateService = yield* DateServiceFx;
	const { kysely } = yield* KyselyContextFx;
	const now = dateService.nowFn().toJSDate();

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "not in", [
			"on-hold",
			"banned",
		])
		.where((ebFn) => {
			return ebFn("cat.restriction", "in", publicCategoryRestrictions);
		})
		.where((ebFn) => {
			return ebFn.or([
				ebFn("l.restriction", "is", null),
				ebFn("l.restriction", "in", publicCategoryRestrictions),
			]);
		});

	if (!hasExplicitCategory) {
		select = select.where("cat.discovery", "=", "implicit");
	}

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => select.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => select.orderBy("l.expiresAt", item.order))
			.with("geo", () => {
				if (!meta?.locationId) {
					return select;
				}
				const locationId = meta.locationId;
				const isDesc = item.order === "desc";
				const sortOrder = isDesc ? "asc" : item.order;

				/**
				 * KNN GiST over geo works for ASC nearest-neighbour ordering.
				 * For DESC (farthest-first), order by distance to the antipode ASC,
				 * which is equivalent and keeps index usage.
				 */
				return select.orderBy((ebFn) => {
					const origin = ebFn
						.selectFrom("location as originLoc")
						.select((ebFn) => {
							return sql`ST_SetSRID(
                                ST_MakePoint(
                                    case
                                        when ${ebFn.val(isDesc)} and ${ebFn.ref("originLoc.lon")} >= 0 then ${ebFn.ref("originLoc.lon")} - 180
                                        when ${ebFn.val(isDesc)} then ${ebFn.ref("originLoc.lon")} + 180
                                        else ${ebFn.ref("originLoc.lon")}
                                    end,
                                    case
                                        when ${ebFn.val(isDesc)} then -${ebFn.ref("originLoc.lat")}
                                        else ${ebFn.ref("originLoc.lat")}
                                    end
                                ),
                                4326
                            )`.as("point");
						})
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`${ebFn.ref("l.withLocation")} <-> (${origin})`;
				}, sortOrder);
			})
			.exhaustive();
	}

	return selectFn({
		select: select.select([
			"l.id",
			"l.categoryId",
			"l.galleryId",
			"l.withImageUrl",
			"l.createdAt",
			"l.title",
			"l.price",
			"l.currency",
			"l.priceType",
			"l.visibleAt",
			"l.expiresAt",
			//
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
			//
			(ebFn) => {
				return sql<CategorySchema.Type>`to_jsonb(${ebFn.table("cat")}.*)`.as("category");
			},
			//
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
			(ebFn) => {
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
			},
			(ebFn) => {
				return ebFn
					.and([
						ebFn("l.status", "=", ListingStatusEnumSchema.enum.live),
						ebFn("l.expiresAt", ">", now),
					])
					.$castTo<boolean>()
					.as("isActive");
			},
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

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				if (where.visibleAtBefore) {
					query = query.where("l.visibleAt", "<", where.visibleAtBefore);
				}

				if (where.visibleAtLte) {
					query = query.where("l.visibleAt", "<=", where.visibleAtLte);
				}

				if (where.visibleAtAfter) {
					query = query.where("l.visibleAt", ">", where.visibleAtAfter);
				}

				if (where.expiresAtBefore) {
					query = query.where("l.expiresAt", "<", where.expiresAtBefore);
				}

				if (where.expiresAtAfter) {
					query = query.where("l.expiresAt", ">", where.expiresAtAfter);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
