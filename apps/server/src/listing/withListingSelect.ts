import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { database } from "../database/kysely";

export namespace withListingSelect {
	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = () => {
	const query = database.kysely
		.selectFrom("listing as l")
		.selectAll("l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.innerJoin("gallery as g", "g.listingId", "l.id")
		.innerJoin("upload as u", "u.id", "g.uploadId");

	return query
		.select((eb) => [
			jsonObjectFrom(eb.selectFrom("loc").selectAll("loc")).as(
				"location",
			),
			jsonObjectFrom(eb.selectFrom("cat").selectAll("cat")).as(
				"category",
			),
			eb.fn
				.coalesce(
					jsonArrayFrom(
						eb
							.selectFrom("g")
							.selectAll("g")
							.select((eb) => [
								jsonObjectFrom(
									eb.selectFrom("u").selectAll("u"),
								).as("upload"),
							]),
					),
					sql`'[]'::json`,
				)
				.as("gallery"),
		])
		.groupBy("l.id");
};
