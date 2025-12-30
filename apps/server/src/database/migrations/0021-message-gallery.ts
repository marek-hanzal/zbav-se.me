import type { Migration } from "kysely";

export const MessageGalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_gallery")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_gallery_[userId]_fk",
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
				"message_gallery_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"message_thread",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"message_gallery_[galleryId]_fk",
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
			.createIndex("message_gallery_[galleryId]_idx")
			.on("message_gallery")
			.column("galleryId")
			.execute();

		await db.schema
			.createIndex("message_gallery_[messageThreadId-createdAt]_idx")
			.on("message_gallery")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("message_gallery_[userId-createdAt]_idx")
			.on("message_gallery")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
