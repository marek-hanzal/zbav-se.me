import type { Migration } from "kysely";

export const UploadMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("upload")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("url", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"upload_userId_fk",
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
			.createIndex("upload_userId_idx")
			.on("upload")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("upload_createdAt_idx")
			.on("upload")
			.column("createdAt")
			.execute();
	},
};
