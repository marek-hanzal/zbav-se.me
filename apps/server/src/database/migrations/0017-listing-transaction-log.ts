import { type Migration, sql } from "kysely";

export const ListingTransactionLogMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_transaction_log")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("listingTransactionId", "text", (col) => col.notNull())
			//
			.addColumn("status", sql`listing_transaction_status`, (col) => col.notNull())
			.addColumn("side", sql`listing_transaction_side`, (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"listing_transaction_log_[listingTransactionId]_fk",
				[
					"listingTransactionId",
				],
				"listing_transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_transaction_log_[listingTransactionId]_idx")
			.on("listing_transaction_log")
			.column("listingTransactionId")
			.execute();
	},
};
