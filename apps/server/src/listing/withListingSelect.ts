import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { database } from "../database/kysely";
import type { ListingQuerySchema } from "./schema/ListingQuerySchema";

export namespace withListingSelect {
	export interface Props {
		sort?: ListingQuerySchema.Type["sort"];
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({ sort }: withListingSelect.Props) => {
	let query = database.kysely
		.selectFrom("listing as l")
		.selectAll("l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
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
						)
							.$notNull()
							.as("upload"),
					)
					.whereRef("g.listingId", "=", "l.id")
					.orderBy("g.sort"),
			).as("gallery"),
		]);

	for (const sortItem of sort ?? []) {
		query = match(sortItem)
			.with(
				{
					type: "listing",
				},
				(sort) => {
					if (!sort.sort) {
						return query;
					}
					const { sort: key, value } = sort;

					return match(value)
						.with("price", () => query.orderBy("l.price", key))
						.with("condition", () =>
							query.orderBy("l.condition", key),
						)
						.with("age", () => query.orderBy("l.age", key))
						.with("createdAt", () =>
							query.orderBy("l.createdAt", key),
						)
						.with("updatedAt", () =>
							query.orderBy("l.updatedAt", key),
						)
						.with("expiresAt", () =>
							query.orderBy("l.expiresAt", key),
						)
						.exhaustive();
				},
			)
			.with(
				{
					type: "geo",
				},
				(sort) => {
					const { sort: key, lon, lat } = sort;
					if (!key) {
						return query;
					}

					return query.orderBy(
						(eb) =>
							sql`${eb.ref("loc.geo")} <-> ST_SetSRID(ST_MakePoint(${eb.val(lon)}, ${eb.val(lat)}), 4326)`,
						key,
					);
				},
			)
			.with(null, () => query)
			.with(undefined, () => query)
			.exhaustive();
	}

	return query;
};
