import { type Migration, sql } from "kysely";

export const ListingTransactionLocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_transaction_location")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("listingTransactionId", "text", (col) => col.notNull())
			//
			.addColumn("event", sql`listing_transaction_event`, (col) => col.notNull())
			.addColumn("side", sql`listing_transaction_side`, (col) => col.notNull())
			//
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("time", "timestamp", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"listing_transaction_location_[listingTransactionId]_fk",
				[
					"listingTransactionId",
				],
				"listing_transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_transaction_location_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_transaction_location_[listingTransactionId]_idx")
			.on("listing_transaction_location")
			.column("listingTransactionId")
			.execute();

		await db.schema
			.createIndex("listing_transaction_location_[locationId]_idx")
			.on("listing_transaction_location")
			.column("locationId")
			.execute();
	},
};
