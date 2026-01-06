import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/app/listing/schema/ListingSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withListingCollectionSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* ({
	sort,
	meta,
}: withListingCollectionSelectFx.Props) {
	const database = yield* DatabaseContextFx;

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
});
