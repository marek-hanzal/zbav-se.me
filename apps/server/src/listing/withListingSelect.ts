import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { database } from "../database/kysely";

export namespace withListingSelect {
	export interface Props {
		requireGallery?: boolean;
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({
	requireGallery = true,
}: withListingSelect.Props = {}) => {
	let query = database.kysely.selectFrom("listing as l").selectAll("l");

	if (requireGallery) {
		query = query.innerJoin("gallery as g", "g.listingId", "l.id");
	}

	return query
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
			eb.fn
				.coalesce(
					jsonArrayFrom(
						eb
							.selectFrom("gallery")
							.selectAll("gallery")
							.select((eb) => [
								jsonObjectFrom(
									eb
										.selectFrom("upload")
										.selectAll("upload")
										.whereRef(
											"upload.id",
											"=",
											"gallery.uploadId",
										)
										.limit(1),
								).as("upload"),
							])
							.whereRef("gallery.listingId", "=", "l.id")
							.orderBy("gallery.sort"),
					),
					sql`'[]'::json`,
				)
				.as("gallery"),
		])
		.groupBy("l.id");
};
