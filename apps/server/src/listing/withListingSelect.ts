import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { database } from "../database/kysely";

export namespace withListingSelect {
	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = () => {
	return database.kysely
		.selectFrom("listing as l")
		.innerJoin("gallery as g", "g.listingId", "l.id")
		.selectAll("l")
		.select((eb) => [
			jsonObjectFrom(
				eb
					.selectFrom("location")
					.selectAll("location")
					.whereRef("location.id", "=", "l.locationId")
					.limit(1),
			).as("location"),
			jsonObjectFrom(
				eb
					.selectFrom("category")
					.selectAll("category")
					.whereRef("category.id", "=", "l.categoryId")
					.limit(1),
			).as("category"),
			jsonObjectFrom(
				eb
					.selectFrom("category_group")
					.selectAll("category_group")
					.whereRef("category_group.id", "=", "l.categoryGroupId")
					.limit(1),
			).as("categoryGroup"),
			eb.fn
				.coalesce(
					jsonArrayFrom(
						eb
							.selectFrom("gallery")
							.selectAll("gallery")
							.whereRef("gallery.listingId", "=", "l.id")
							.orderBy("gallery.sort"),
					),
					sql`'[]'::json`,
				)
				.as("gallery"),
		])
		.groupBy("l.id");
};
