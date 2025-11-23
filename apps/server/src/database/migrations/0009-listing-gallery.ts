import type { Migration } from "kysely";

export const ListingGalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"listing_gallery_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_gallery_[galleryId]_fk",
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
			.createIndex("listing_gallery_[listingId]_idx")
			.on("listing_gallery")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_gallery_[galleryId]_idx")
			.on("listing_gallery")
			.column("galleryId")
			.execute();

		await db.schema
			.createIndex("listing_gallery_[createdAt]_idx")
			.on("listing_gallery")
			.column("createdAt")
			.execute();
	},
};
