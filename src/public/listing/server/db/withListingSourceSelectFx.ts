import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/public/listing/server/schema/ListingSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

const publicCategoryRestrictions = [
	CategoryRestrictionEnumSchema.enum.none,
	CategoryRestrictionEnumSchema.enum["adult-relaxed"],
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
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		] as const)
		.where((eb) => {
			return sql<boolean>`array[${eb.ref("cat.restriction")}] <@ array[${sql.join(publicCategoryRestrictions)}]::category_restriction_enum[]`;
		})
		.where((eb) => {
			return sql<boolean>`coalesce(${eb.ref("l.restriction")}, ${CategoryRestrictionEnumSchema.enum.none}::category_restriction_enum) = any(array[${sql.join(publicCategoryRestrictions)}]::category_restriction_enum[])`;
		});

	if (!hasExplicitCategory) {
		query = query.where("cat.discovery", "=", "implicit");
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
				if (!meta?.latLon) {
					return query;
				}
				const { lon, lat } = meta.latLon;
				const isDesc = item.order === "desc";
				const sortOrder = isDesc ? "asc" : item.order;
				const sortLon = isDesc ? (lon >= 0 ? lon - 180 : lon + 180) : lon;
				const sortLat = isDesc ? -lat : lat;

				return query.orderBy(
					(eb) =>
						sql`${eb.ref("loc.geo")} <-> ST_SetSRID(ST_MakePoint(${eb.val(
							sortLon,
						)}, ${eb.val(sortLat)}), 4326)`,
					sortOrder,
				);
			})
			.exhaustive();
	}

	return query;
});
