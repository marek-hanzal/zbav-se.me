import type { Migration } from "kysely";

export const BoardMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("board")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"board_[userId]_fk",
				["userId"],
				"user",
				["id"],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema.createIndex("board_[userId]_idx").on("board").column("userId").execute();

		await db.schema
			.createIndex("board_[createdAt]_idx")
			.on("board")
			.column("createdAt")
			.execute();
	},
};
