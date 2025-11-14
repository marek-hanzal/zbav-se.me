import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingMetaSchema } from "../schema/ListingMetaSchema";
import type { ListingSortSchema } from "../schema/ListingSortSchema";

export namespace withListingSelect {
	export interface Props {
		userId: string;
		sort: ListingSortSchema.Type[] | undefined;
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({ userId, sort, meta }: withListingSelect.Props) => {
	const query = database.kysely
		.selectFrom("listing as l")
		.select([
			"l.age",
			"l.categoryId",
			"l.condition",
			"l.createdAt",
			"l.currency",
			"l.title",
			"l.description",
			"l.expiresAt",
			"l.id",
			"l.locationId",
			"l.price",
			"l.updatedAt",
		])
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.select((eb) => [
			jsonObjectFrom(
				eb.selectFrom("location as loc").selectAll("loc").whereRef("loc.id", "=", "l.locationId").limit(1),
			)
				.$notNull()
				.as("location"),

			jsonObjectFrom(
				eb.selectFrom("category as cat").selectAll("cat").whereRef("cat.id", "=", "l.categoryId").limit(1),
			)
				.$notNull()
				.as("category"),

			jsonArrayFrom(
				eb
					.selectFrom("gallery as g")
					.selectAll("g")
					.select((eb) =>
						jsonObjectFrom(
							eb.selectFrom("upload as u").selectAll("u").whereRef("u.id", "=", "g.uploadId").limit(1),
						)
							.$notNull()
							.as("upload"),
					)
					.whereRef("g.listingId", "=", "l.id")
					.orderBy("g.sort"),
			).as("gallery"),
			eb
				.exists(
					eb
						.selectFrom("listing_cart as lc")
						.select(sql`1`.as("true"))
						.whereRef("lc.listingId", "=", "l.id")
						.where("lc.userId", "=", userId),
				)
				.as("isInCart"),
			eb
				.exists(
					eb
						.selectFrom("listing_ignore as li")
						.select(sql`1`.as("true"))
						.whereRef("li.listingId", "=", "l.id")
						.where("li.userId", "=", userId),
				)
				.as("isIgnored"),
			eb
				.exists(
					eb
						.selectFrom("listing_flag as lf")
						.select(sql`1`.as("true"))
						.whereRef("lf.listingId", "=", "l.id")
						.where("lf.userId", "=", userId),
				)
				.as("hasFlag"),
		]);

	for (const item of sort ?? []) {
		return match(item.field)
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
						sql`${eb.ref("loc.geo")} <-> ST_SetSRID(ST_MakePoint(${eb.val(lon)}, ${eb.val(lat)}), 4326)`,
					item.direction,
				);
			})
			.exhaustive();
	}

	return query;
};
