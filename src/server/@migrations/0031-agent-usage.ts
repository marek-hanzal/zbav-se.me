import { type Migration, sql } from "kysely";

export const AgentUsageMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("agent_usage")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("threadId", "text", (col) => col.notNull())
			.addColumn("requests", "integer", (col) => col.notNull())
			.addColumn("input", "integer", (col) => col.notNull())
			.addColumn("total", "integer", (col) => col.notNull())
			.addColumn("output", "integer", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"agent_usage_[threadId]_fk",
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
        CREATE INDEX "agent_usage_[userId-threadId-createdAt]_idx" ON "agent_usage" ("userId", "threadId", "createdAt" ASC);
		`.execute(db);

		await db.schema
			.createIndex("agent_usage_[threadId-createdAt]_idx")
			.on("agent_usage")
			.columns([
				"threadId",
				"createdAt",
			])
			.execute();
	},
};
