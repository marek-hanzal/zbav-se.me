import { sql } from "kysely";
import { match } from "ts-pattern";
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
	const statusQuery = database.selectFrom("listing_transaction_status as lts").select((eb) => [
		eb.ref("lts.status").$castTo<ListingTransactionStatusEnumSchema.Type>().as("status"),
		"lts.id",
		"lts.listingTransactionId",
		eb.ref("lts.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"lts.side",
		"lts.createdAt",
		sql<string>`'message'`.as("message"),
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
	]);

	const messageQuery = database.selectFrom("listing_transaction_message as ltm").select((eb) => [
		sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
			"status",
		),
		"ltm.id",
		"ltm.listingTransactionId",
		eb.ref("ltm.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"ltm.side",
		"ltm.createdAt",
		"ltm.message",
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
	]);

	const galleryQuery = database.selectFrom("listing_transaction_gallery as ltg").select((eb) => [
		sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
			"status",
		),
		"ltg.id",
		"ltg.listingTransactionId",
		eb.ref("ltg.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"ltg.side",
		"ltg.createdAt",
		sql<string>`'message'`.as("message"),
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		"ltg.galleryId",
	]);

	const locationQuery = database
		.selectFrom("listing_transaction_location as ltl")
		.select((eb) => [
			sql<ListingTransactionStatusEnumSchema.Type>`'request'::listing_transaction_status_enum`.as(
				"status",
			),
			"ltl.id",
			"ltl.listingTransactionId",
			eb.ref("ltl.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
			"ltl.side",
			"ltl.createdAt",
			sql<string>`'message'`.as("message"),
			"ltl.locationId",
			"ltl.time",
			sql<string>`'galleryId'`.as("galleryId"),
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
