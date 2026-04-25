import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withActiveUserRestrictionSelectFx } from "~/user/user-restriction/server/db/withActiveUserRestrictionSelectFx";

export namespace withListingSourceSelectFx {
	export interface Props {
		userId: string;
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
		hasExplicitCategory?: boolean;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	userId,
	sort,
	meta,
	hasExplicitCategory,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const fallbackSql = sql`${RestrictionEnumSchema.enum.none}::restriction_enum`;
	const restrictionSql = yield* withActiveUserRestrictionSelectFx({
		userId,
	});

	let query = kysely
		.selectFrom("listing as l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.where("l.status", "in", [
			"live",
		] as const)
		.where((eb) => {
			return sql<boolean>`coalesce(${eb.ref("cat.restriction")}, ${fallbackSql}) <= ${restrictionSql}`;
		})
		.where((eb) => {
			return sql<boolean>`coalesce(${eb.ref("l.restriction")}, ${fallbackSql}) <= ${restrictionSql}`;
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
				/**
				 * KNN GiST over geo works for ASC nearest-neighbour ordering.
				 * For DESC (farthest-first), order by distance to the antipode ASC,
				 * which is equivalent and keeps index usage.
				 */
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
