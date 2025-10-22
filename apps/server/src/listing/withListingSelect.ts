import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { database } from "../database/kysely";

export const withListingSelect = () => {
	return database.kysely
		.selectFrom("listing")
		.selectAll("listing")
		.select((eb) => [
			jsonObjectFrom(
				eb
					.selectFrom("location")
					.selectAll("location")
					.whereRef("location.id", "=", "listing.locationId")
					.limit(1),
			).as("location"),
			eb.fn
				.coalesce(
					jsonArrayFrom(
						eb
							.selectFrom("gallery")
							.selectAll("gallery")
							.whereRef("gallery.listingId", "=", "listing.id")
							.orderBy("gallery.sort"),
					),
					sql`'[]'::json`,
				)
				.as("gallery"),
		]);
};
