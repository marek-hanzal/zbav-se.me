import type { Migration } from "kysely";

export const DraftGalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"draft_gallery_[draftId]_fk",
				[
					"draftId",
				],
				"draft",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"draft_gallery_[galleryId]_fk",
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
			.createIndex("draft_gallery_[draftId]_idx")
			.on("draft_gallery")
			.column("draftId")
			.execute();

		await db.schema
			.createIndex("draft_gallery_[galleryId]_idx")
			.on("draft_gallery")
			.column("galleryId")
			.execute();

		await db.schema
			.createIndex("draft_gallery_[createdAt]_idx")
			.on("draft_gallery")
			.column("createdAt")
			.execute();
	},
};
