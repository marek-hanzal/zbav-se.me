import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/app/listing/schema/ListingSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingCollectionSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingSortSchema.Type[] | undefined;
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = ReturnType<typeof withListingCollectionSelect>;
}

export const withListingCollectionSelect = ({
	database,
	sort,
	meta,
}: withListingCollectionSelect.Props) => {
	let query = database
		.selectFrom("listing as l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.select("l.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("price", () => query.orderBy("l.price", item.direction))
			.with("condition", () => query.orderBy("l.condition", item.direction))
			.with("age", () => query.orderBy("l.age", item.direction))
			.with("createdAt", () => query.orderBy("l.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.direction))
			.with("geo", () => {
				if (!meta?.latLon) {
					return query;
				}
				const { lon, lat } = meta.latLon;

				return query.orderBy(
					(eb) =>
						sql`${eb.ref("loc.geo")} <-> ST_SetSRID(ST_MakePoint(${eb.val(
							lon,
						)}, ${eb.val(lat)}), 4326)`,
					item.direction,
				);
			})
			.exhaustive();
	}

	return query;
};
