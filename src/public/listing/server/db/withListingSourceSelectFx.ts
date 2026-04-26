import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/public/listing/server/schema/ListingSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

const publicCategoryRestrictions = [
	RestrictionEnumSchema.enum.none,
	RestrictionEnumSchema.enum["adult-relaxed"],
] as const;

export namespace withListingSourceSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory?: boolean;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	sort,
	meta,
	hasExplicitCategory,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("listing as l")
		.where("l.status", "in", [
			"live",
		] as const)
		.where((eb) =>
			eb.or([
				eb("l.withCategoryRestriction", "is", null),
				eb("l.withCategoryRestriction", "in", publicCategoryRestrictions),
			]),
		)
		.where((eb) =>
			eb.or([
				eb("l.restriction", "is", null),
				eb("l.restriction", "in", publicCategoryRestrictions),
			]),
		);

	if (!hasExplicitCategory) {
		query = query.where("l.withCategoryDiscovery", "=", "implicit");
	}

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("price", () => query.orderBy("l.price", item.order))
			.with("condition", () => query.orderBy("l.condition", item.order))
			.with("age", () => query.orderBy("l.age", item.order))
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.with("geo", () => {
				if (!meta?.locationId) {
					return query;
				}
				const locationId = meta.locationId;
				const isDesc = item.order === "desc";
				const sortOrder = isDesc ? "asc" : item.order;

				return query.orderBy((eb) => {
					const originPointSelect = eb
						.selectFrom("location as originLoc")
						.select((originEb) =>
							sql`ST_SetSRID(
									ST_MakePoint(
										case
											when ${originEb.val(isDesc)} and ${originEb.ref("originLoc.lon")} >= 0 then ${originEb.ref("originLoc.lon")} - 180
											when ${originEb.val(isDesc)} then ${originEb.ref("originLoc.lon")} + 180
											else ${originEb.ref("originLoc.lon")}
										end,
										case
											when ${originEb.val(isDesc)} then -${originEb.ref("originLoc.lat")}
											else ${originEb.ref("originLoc.lat")}
										end
									),
									4326
								)`.as("point"),
						)
						.where("originLoc.id", "=", locationId)
						.limit(1);

					return sql`${eb.ref("l.withLocationGeo")} <-> (
							${originPointSelect}
						)`;
				}, sortOrder);
			})
			.exhaustive();
	}

	return query;
});
