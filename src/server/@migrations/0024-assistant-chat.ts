import { type Migration, sql } from "kysely";

export const AssistantChatMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("assistant_chat")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addForeignKeyConstraint(
				"assistant_chat_[userId]_fk",
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

		await sql`
			CREATE INDEX "assistant_chat_[userId-sort]_idx" ON "assistant_chat" ("userId", "sort" ASC);
		`.execute(db);
	},
};
