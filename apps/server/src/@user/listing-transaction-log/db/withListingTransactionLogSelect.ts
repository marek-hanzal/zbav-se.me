import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { ListingTransactionLogSortSchema } from "~/@user/listing-transaction-log/schema/ListingTransactionLogSortSchema";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import type { ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusEnumSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingTransactionLogSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionLogSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionLogSelect>;
}

export const withListingTransactionLogSelect = ({
	database,
	sort,
}: withListingTransactionLogSelect.Props) => {
	const statusQuery = database.selectFrom("listing_transaction_status as lts").select([
		"lts.side",
		"lts.id",
		"lts.listingTransactionId",
		sql<ListingTransactionEventEnumSchema.Type>`'status'`.as("event"),
		"lts.createdAt",
		//
		"lts.status",
		sql<string>`'message'`.as("message"),
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null`.as("gallery"),
	]);

	const messageQuery = database.selectFrom("listing_transaction_message as ltm").select([
		"ltm.side",
		"ltm.id",
		"ltm.listingTransactionId",
		sql<ListingTransactionEventEnumSchema.Type>`'message'`.as("event"),
		"ltm.createdAt",
		sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
			"status",
		),
		"ltm.message",
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null`.as("gallery"),
	]);

	const galleryQuery = database.selectFrom("listing_transaction_gallery as ltg").select([
		"ltg.side",
		"ltg.id",
		"ltg.listingTransactionId",
		sql<ListingTransactionEventEnumSchema.Type>`'gallery'`.as("event"),
		"ltg.createdAt",
		sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
			"status",
		),
		sql<string>`'message'`.as("message"),
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		"ltg.galleryId",
		(eb) =>
			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.whereRef("gal.id", "in", eb.ref("ltg.galleryId"))
					.limit(1),
			)
				.$notNull()
				.as("gallery"),
	]);

	const locationQuery = database.selectFrom("listing_transaction_location as ltl").select([
		"ltl.side",
		"ltl.id",
		"ltl.listingTransactionId",
		sql<ListingTransactionEventEnumSchema.Type>`'location'`.as("event"),
		"ltl.createdAt",
		sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
			"status",
		),
		sql<string>`'message'`.as("message"),
		"ltl.locationId",
		"ltl.time",
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null`.as("gallery"),
	]);

	const unionQuery = statusQuery
		.unionAll(messageQuery)
		.unionAll(galleryQuery)
		.unionAll(locationQuery);

	let query = database
		.selectFrom(unionQuery.as("log"))
		.leftJoin("listing_transaction as lt", "log.listingTransactionId", "lt.id")
		.leftJoin("listing as l", "lt.listingId", "l.id")
		.selectAll("log")
		.select([
			"lt.userId",
			"l.userId as listingUserId",
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("log.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
