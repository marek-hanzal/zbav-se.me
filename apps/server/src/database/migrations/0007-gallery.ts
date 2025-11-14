import type { Migration } from "kysely";

export const GalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("uploadId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"gallery_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"gallery_[listingId]_fk",
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
				"gallery_[uploadId]_fk",
				[
					"uploadId",
				],
				"upload",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema.createIndex("gallery_[userId]_idx").on("gallery").column("userId").execute();

		await db.schema.createIndex("gallery_[listingId]_idx").on("gallery").column("listingId").execute();

		await db.schema.createIndex("gallery_[createdAt]_idx").on("gallery").column("createdAt").execute();
	},
};
