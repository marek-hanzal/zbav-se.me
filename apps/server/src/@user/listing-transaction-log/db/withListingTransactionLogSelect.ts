import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingTransactionLogSortSchema } from "~/@user/listing-transaction-log/schema/ListingTransactionLogSortSchema";
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
	// Union all event tables into a single log view
	const statusQuery = database.selectFrom("listing_transaction_status as lts").select([
		"lts.id",
		"lts.listingTransactionId",
		"lts.event",
		"lts.side",
		sql<"request" | "accepted" | "rejected" | "success" | "closed" | "expired">`lts.status`.as(
			"status",
		),
		sql<string | null>`null`.as("message"),
		sql<string | null>`null`.as("galleryId"),
		sql<string | null>`null`.as("locationId"),
		sql<Date | null>`null`.as("time"),
		"lts.createdAt",
	]);

	const messageQuery = database.selectFrom("listing_transaction_message as ltm").select([
		"ltm.id",
		"ltm.listingTransactionId",
		"ltm.event",
		"ltm.side",
		sql<"request" | "accepted" | "rejected" | "success" | "closed" | "expired" | null>`null`.as(
			"status",
		),
		"ltm.message",
		sql<string | null>`null`.as("galleryId"),
		sql<string | null>`null`.as("locationId"),
		sql<Date | null>`null`.as("time"),
		"ltm.createdAt",
	]);

	const galleryQuery = database.selectFrom("listing_transaction_gallery as ltg").select([
		"ltg.id",
		"ltg.listingTransactionId",
		"ltg.event",
		"ltg.side",
		sql<"request" | "accepted" | "rejected" | "success" | "closed" | "expired" | null>`null`.as(
			"status",
		),
		sql<string | null>`null`.as("message"),
		"ltg.galleryId",
		sql<string | null>`null`.as("locationId"),
		sql<Date | null>`null`.as("time"),
		"ltg.createdAt",
	]);

	const locationQuery = database.selectFrom("listing_transaction_location as ltl").select([
		"ltl.id",
		"ltl.listingTransactionId",
		"ltl.event",
		"ltl.side",
		sql<"request" | "accepted" | "rejected" | "success" | "closed" | "expired" | null>`null`.as(
			"status",
		),
		sql<string | null>`null`.as("message"),
		sql<string | null>`null`.as("galleryId"),
		"ltl.locationId",
		"ltl.time",
		"ltl.createdAt",
	]);

	// Union all queries
	const unionQuery = statusQuery
		.unionAll(messageQuery as any)
		.unionAll(galleryQuery as any)
		.unionAll(locationQuery as any);

	// Wrap in a subquery to allow ordering
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
