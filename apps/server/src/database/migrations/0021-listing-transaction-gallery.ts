import { type Migration, sql } from "kysely";

export const ListingTransactionGalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_transaction_gallery")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("listingTransactionId", "text", (col) => col.notNull())
			//
			.addColumn("event", sql`listing_transaction_event_enum`, (col) => col.notNull())
			.addColumn("side", sql`listing_transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"listing_transaction_gallery_[listingTransactionId]_fk",
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
				"listing_transaction_gallery_[galleryId]_fk",
				[
					"galleryId",
				],
				"gallery",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_transaction_gallery_[listingTransactionId]_idx")
			.on("listing_transaction_gallery")
			.column("listingTransactionId")
			.execute();

		await db.schema
			.createIndex("listing_transaction_gallery_[galleryId]_idx")
			.on("listing_transaction_gallery")
			.column("galleryId")
			.execute();
	},
};
