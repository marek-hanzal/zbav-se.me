import { type Migration, sql } from "kysely";

export const GalleryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("access", sql`access_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
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
			.execute();

		await db.schema
			.createIndex("gallery_[userId]_idx")
			.on("gallery")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("gallery_[access]_idx")
			.on("gallery")
			.column("access")
			.execute();

		await db.schema
			.createIndex("gallery_[createdAt]_idx")
			.on("gallery")
			.column("createdAt")
			.execute();
	},
};
