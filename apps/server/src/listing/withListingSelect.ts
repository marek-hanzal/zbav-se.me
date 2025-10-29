import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { database } from "../database/kysely";

export namespace withListingSelect {
	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = () => {
	const q = database.kysely
		.selectFrom("listing as l")
		.selectAll("l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId");

	return q.select((eb) => [
		jsonObjectFrom(
			eb
				.selectFrom("location as loc")
				.selectAll("loc")
				.whereRef("loc.id", "=", "l.locationId")
				.limit(1),
		).as("location"),

		jsonObjectFrom(
			eb
				.selectFrom("category as cat")
				.selectAll("cat")
				.whereRef("cat.id", "=", "l.categoryId")
				.limit(1),
		).as("category"),

		jsonArrayFrom(
			eb
				.selectFrom("gallery as g")
				.selectAll("g")
				.select((eb) =>
					jsonObjectFrom(
						eb
							.selectFrom("upload as u")
							.selectAll("u")
							.whereRef("u.id", "=", "g.uploadId")
							.limit(1),
					).as("upload"),
				)
				.whereRef("g.listingId", "=", "l.id")
				.orderBy("g.sort"),
		).as("gallery"),
	]);
};
