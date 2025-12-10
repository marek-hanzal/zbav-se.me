import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { ListingTransactionSortSchema } from "~/@user/listing-transaction/schema/ListingTransactionSortSchema";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingTransactionSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionSelect>;
}

export const withListingTransactionSelect = ({
	database,
	sort,
}: withListingTransactionSelect.Props) => {
	let query = database
		.selectFrom("listing_transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.innerJoin("location as loc", "l.locationId", "loc.id")
		.selectAll("lt")
		.select([
			"l.title",
			"l.price",
			"l.currency",
			(eb) => sql<LocationDbSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			(eb) =>
				jsonObjectFrom(
					withGallerySelect({
						database,
						sort: undefined,
					})
						.where(
							"gal.id",
							"in",
							eb
								.selectFrom("listing_gallery as lg")
								.select("lg.galleryId")
								.whereRef("lg.listingId", "=", "l.id")
								.orderBy("lg.createdAt", "desc")
								.limit(1),
						)
						.limit(1),
				)
					.$notNull()
					.as("gallery"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
