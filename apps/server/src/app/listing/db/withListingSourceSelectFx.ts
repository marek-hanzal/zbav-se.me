import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/app/listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/app/listing/schema/ListingSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withListingSourceSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	sort,
	meta,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("listing as l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId");

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
