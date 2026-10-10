import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const GalleryItemMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("gallery_item")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("galleryId", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("uploadId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"gallery_item_[galleryId]_fk",
				[
					"galleryId",
				],
				"gallery",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"gallery_item_[uploadId]_fk",
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

		await db.schema
			.createIndex("gallery_item_[galleryId]_idx")
			.on("gallery_item")
			.column("galleryId")
			.execute();

		await sql`
			CREATE INDEX "gallery_item_[galleryId-sort]_idx"
			ON "gallery_item" ("galleryId", "sort")
			INCLUDE ("id", "uploadId")
		`.execute(db);

		await db.schema
			.createIndex("gallery_item_[createdAt]_idx")
			.on("gallery_item")
			.column("createdAt")
			.execute();
	},
};
