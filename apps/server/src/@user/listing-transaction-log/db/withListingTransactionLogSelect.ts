import { jsonBuildObject } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { ListingTransactionLogSortSchema } from "~/@user/listing-transaction-log/schema/ListingTransactionLogSortSchema";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
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
		"lts.id",
		"lts.listingTransactionId",
		(eb) => eb.ref("lts.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"lts.side",
		"lts.createdAt",
		jsonBuildObject({
			status: eb.ref("lts.status"),
		})
			.$castTo<any>()
			.as("payload"),
	]);

	const messageQuery = database.selectFrom("listing_transaction_message as ltm").select((eb) => [
		"ltm.id",
		"ltm.listingTransactionId",
		(eb) => eb.ref("ltm.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"ltm.side",
		"ltm.createdAt",
		jsonBuildObject({
			message: eb.ref("ltm.message"),
		})
			.$castTo<any>()
			.as("payload"),
	]);

	const galleryQuery = database.selectFrom("listing_transaction_gallery as ltg").select((eb) => [
		"ltg.id",
		"ltg.listingTransactionId",
		(eb) => eb.ref("ltg.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
		"ltg.side",
		"ltg.createdAt",
		jsonBuildObject({
			galleryId: eb.ref("ltg.galleryId"),
		})
			.$castTo<any>()
			.as("payload"),
	]);

	const locationQuery = database
		.selectFrom("listing_transaction_location as ltl")
		.select((eb) => [
			"ltl.id",
			"ltl.listingTransactionId",
			(eb) =>
				eb.ref("ltl.event").$castTo<ListingTransactionEventEnumSchema.Type>().as("event"),
			"ltl.side",
			"ltl.createdAt",
			jsonBuildObject({
				locationId: eb.ref("ltl.locationId"),
				time: eb.ref("ltl.time"),
			})
				.$castTo<any>()
				.as("payload"),
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
