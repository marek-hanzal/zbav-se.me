import type { Migration } from "kysely";

export const UploadMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("upload")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("url", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"upload_[userId]_fk",
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

		await db.schema.createIndex("upload_[userId]_idx").on("upload").column("userId").execute();

		await db.schema
			.createIndex("upload_[createdAt]_idx")
			.on("upload")
			.column("createdAt")
			.execute();
	},
};
