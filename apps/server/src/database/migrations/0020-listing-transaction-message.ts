import { type Migration, sql } from "kysely";

export const ListingTransactionMessageMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_transaction_message")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("listingTransactionId", "text", (col) => col.notNull())
			.addColumn("side", sql`listing_transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("message", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"listing_transaction_message_[listingTransactionId]_fk",
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
			.createIndex("listing_transaction_message_[listingTransactionId]_idx")
			.on("listing_transaction_message")
			.column("listingTransactionId")
			.execute();
	},
};
