import type { Migration } from "kysely";

export const BoardItemMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("board_item")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("boardId", "text", (col) => col.notNull())
			.addColumn("x", "integer", (col) => col.notNull())
			.addColumn("y", "integer", (col) => col.notNull())
			.addColumn("level", "integer", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"board_item_[boardId]_fk",
				["boardId"],
				"board",
				["id"],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("board_item_[boardId]_idx")
			.on("board_item")
			.column("boardId")
			.execute();

		await db.schema
			.createIndex("board_item_[createdAt]_idx")
			.on("board_item")
			.column("createdAt")
			.execute();
	},
};
