import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import type { CategorySchema } from "~/public/category/server/schema/CategorySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withNormalizedContainsEx } from "~/server/database/expression/withNormalizedContainsEx";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import type { ListingMetaSchema } from "../schema/ListingMetaSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
	const { kysely } = yield* KyselyContextFx;

	let select = kysely
		.selectFrom("listing as l")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		])
		.where((eb) => {
			return eb("cat.restriction", "in", publicCategoryRestrictions);
		})
		.where((eb) => {
			return eb.or([
				eb("l.restriction", "is", null),
				eb("l.restriction", "in", publicCategoryRestrictions),
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
				return select.orderBy((eb) => {
					const origin = eb
						.selectFrom("location as originLoc")
						.select((eb) => {
							return sql`ST_SetSRID(
                                ST_MakePoint(
                                    case
                                        when ${eb.val(isDesc)} and ${eb.ref("originLoc.lon")} >= 0 then ${eb.ref("originLoc.lon")} - 180
                                        when ${eb.val(isDesc)} then ${eb.ref("originLoc.lon")} + 180
                                        else ${eb.ref("originLoc.lon")}
                                    end,
                                    case
                                        when ${eb.val(isDesc)} then -${eb.ref("originLoc.lat")}
                                        else ${eb.ref("originLoc.lat")}
                                    end
                                ),
                                4326
                            )`.as("point");
						})
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`${eb.ref("l.withLocation")} <-> (${origin})`;
				}, sortOrder);
			})
			.exhaustive();
	}

	return selectFx({
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
			//
			(eb) => {
				return eb
					.selectFrom("location as loc")
					.select((eb) => {
						return sql<LocationSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("json");
					})
					.whereRef("loc.id", "=", "l.locationId")
					.limit(1)
					.$asScalar()
					.$castTo<LocationSchema.Type>()
					.as("location");
			},
			//
			(eb) => {
				return sql<CategorySchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category");
			},
			//
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
			(eb) => {
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

				if (where.categoryId) {
					query = query.where("l.categoryId", "=", where.categoryId);
				}

				if (where.categoryIdIn && where.categoryIdIn.length > 0) {
					query = query.where("l.categoryId", "in", where.categoryIdIn);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
