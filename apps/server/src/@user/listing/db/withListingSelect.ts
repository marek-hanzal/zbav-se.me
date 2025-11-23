import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/@user/listing/schema/ListingSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingSelect {
	export interface Props {
		database: WithDatabase;
		userId: string;
		sort: ListingSortSchema.Type[] | undefined;
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({ database, userId, sort, meta }: withListingSelect.Props) => {
	let query = database
		.selectFrom("listing as l")
		.leftJoin(
			(eb) =>
				eb
					.selectFrom("listing_transaction as lt")
					.select((eb) => [
						"lt.listingId",
						eb.fn.max("lt.updatedAt").as("transactionUpdatedAt"),
					])
					.groupBy("lt.listingId")
					.as("ltx"),
			(join) => join.onRef("ltx.listingId", "=", "l.id"),
		)
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
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
		.select((eb) => [
			jsonObjectFrom(
				eb
					.selectFrom("location as loc")
					.selectAll("loc")
					.whereRef("loc.id", "=", "l.locationId")
					.limit(1),
			)
				.$notNull()
				.as("location"),

			jsonObjectFrom(
				eb
					.selectFrom("category as cat")
					.selectAll("cat")
					.whereRef("cat.id", "=", "l.categoryId")
					.limit(1),
			)
				.$notNull()
				.as("category"),

			jsonObjectFrom(
				eb
					.selectFrom("gallery as g")
					.where(
						"g.id",
						"in",
						eb
							.selectFrom("listing_gallery as lg")
							.select("lg.galleryId")
							.whereRef("lg.listingId", "=", "l.id")
							.orderBy("lg.createdAt", "desc")
							.limit(1),
					)
					.selectAll("g")
					.select((eb2) => [
						jsonArrayFrom(
							eb2
								.selectFrom("gallery_item as gi")
								.selectAll("gi")
								.select((eb3) =>
									jsonObjectFrom(
										eb3
											.selectFrom("upload as u")
											.selectAll("u")
											.whereRef("u.id", "=", "gi.uploadId")
											.limit(1),
									)
										.$notNull()
										.as("upload"),
								)
								.whereRef("gi.galleryId", "=", "g.id")
								.orderBy("gi.sort"),
						)
							.$notNull()
							.as("items"),
					])
					.limit(1),
			)
				.$notNull()
				.as("gallery"),

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

			eb
				.exists(
					eb
						.selectFrom("listing_transaction as lt")
						.select(sql`1`.as("true"))
						.whereRef("lt.listingId", "=", "l.id")
						.where("lt.userId", "=", userId)
						.where("lt.status", "in", [
							"request",
							"accepted",
						]),
				)
				.as("hasTransaction"),
		]);

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
			.with("transaction", () => query.orderBy("ltx.transactionUpdatedAt", item.direction))
			.exhaustive();
	}

	return query;
};
