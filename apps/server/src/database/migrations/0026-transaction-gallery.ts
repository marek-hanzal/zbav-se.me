import { type Migration, sql } from "kysely";

export const TransactionGalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_gallery")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"transaction_gallery_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"transaction_gallery_[galleryId]_fk",
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
			.createIndex("transaction_gallery_[messageThreadId]_idx")
			.on("transaction_gallery")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("transaction_gallery_[galleryId]_idx")
			.on("transaction_gallery")
			.column("galleryId")
			.execute();
	},
};
