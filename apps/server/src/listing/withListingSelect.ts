import {
	jsonArrayFrom,
	jsonBuildObject,
	jsonObjectFrom,
} from "kysely/helpers/postgres";
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
				.innerJoin("upload as u", "u.id", "g.uploadId")
				.select((eb) =>
					jsonBuildObject({
						id: eb.ref("g.id"),
						listingId: eb.ref("g.listingId"),
						uploadId: eb.ref("g.uploadId"),
						sort: eb.ref("g.sort"),
						createdAt: eb.ref("g.createdAt"),
						upload: jsonBuildObject({
							id: eb.ref("u.id"),
							url: eb.ref("u.url"),
						}),
					}).as("item"),
				)
				.whereRef("g.listingId", "=", "l.id")
				.orderBy("g.sort"),
		).as("gallery"),
	]);
	// Není potřeba groupBy, protože nahoře nic neagregujeme v hlavním SELECTu
};
