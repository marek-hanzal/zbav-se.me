import type { Migration } from "kysely";

export const GalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("url", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addColumn("updatedAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"gallery_userId_fk",
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
				"gallery_listingId_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("gallery_userId_idx")
			.on("gallery")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("gallery_listingId_idx")
			.on("gallery")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("gallery_createdAt_idx")
			.on("gallery")
			.column("createdAt")
			.execute();
	},
};
