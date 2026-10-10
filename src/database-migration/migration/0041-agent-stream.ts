import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const AgentStreamMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("agent_stream")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("threadId", "text", (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addForeignKeyConstraint(
				"agent_stream_[threadId]_fk",
				[
					"threadId",
				],
				"agent_thread",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await sql`
			CREATE INDEX "agent_stream_[userId-threadId-sort]_idx" ON "agent_stream" ("userId", "threadId", "sort" ASC);
		`.execute(db);

		await db.schema
			.createIndex("agent_stream_[threadId-sort]_idx")
			.on("agent_stream")
			.columns([
				"threadId",
				"sort",
			])
			.execute();
	},
};
