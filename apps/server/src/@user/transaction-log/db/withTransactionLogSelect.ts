import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { TransactionLogSortSchema } from "~/@user/transaction-log/schema/TransactionLogSortSchema";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/TransactionEventEnumSchema";
import type { TransactionStatusEnumSchema } from "~/app/transaction/schema/TransactionStatusEnumSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withTransactionLogSelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionLogSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionLogSelect>;
}

export const withTransactionLogSelect = ({ database, sort }: withTransactionLogSelect.Props) => {
	const statusQuery = database.selectFrom("transaction_status as lts").select([
		"lts.side",
		"lts.id",
		"lts.messageThreadId",
		sql<TransactionEventEnumSchema.Type>`'status'`.as("event"),
		"lts.createdAt",
		//
		"lts.status",
		sql<string>`'message'`.as("message"),
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null::json`.as("gallery"),
	]);

	const messageQuery = database.selectFrom("message as m").select([
		"m.side",
		"m.id",
		"m.messageThreadId",
		sql<TransactionEventEnumSchema.Type>`'message'`.as("event"),
		"m.createdAt",
		sql<TransactionStatusEnumSchema.Type>`'request'::transaction_status_enum`.as("status"),
		"m.message",
		sql<string>`'locationId'`.as("locationId"),
		sql<Date>`now()`.as("time"),
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null::json`.as("gallery"),
	]);

	const galleryQuery = database.selectFrom("transaction_gallery as ltg").select([
		"ltg.side",
		"ltg.id",
		"ltg.messageThreadId",
		sql<TransactionEventEnumSchema.Type>`'gallery'`.as("event"),
		"ltg.createdAt",
		sql<TransactionStatusEnumSchema.Type>`'request'::transaction_status_enum`.as("status"),
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
					.whereRef("gal.id", "=", eb.ref("ltg.galleryId"))
					.limit(1),
			)
				.$notNull()
				.as("gallery"),
	]);

	const locationQuery = database.selectFrom("transaction_location as ltl").select([
		"ltl.side",
		"ltl.id",
		"ltl.messageThreadId",
		sql<TransactionEventEnumSchema.Type>`'location'`.as("event"),
		"ltl.createdAt",
		sql<TransactionStatusEnumSchema.Type>`'request'::transaction_status_enum`.as("status"),
		sql<string>`'message'`.as("message"),
		"ltl.locationId",
		"ltl.time",
		sql<string>`'galleryId'`.as("galleryId"),
		sql<any>`null::json`.as("gallery"),
	]);

	const unionQuery = statusQuery
		.unionAll(messageQuery)
		.unionAll(galleryQuery)
		.unionAll(locationQuery);

	let query = database
		.selectFrom(unionQuery.as("log"))
		.leftJoin("transaction as lt", "log.messageThreadId", "lt.id")
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
