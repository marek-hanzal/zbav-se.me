import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const AgentThreadMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("agent_thread")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addColumn("archivedAt", "timestamptz")
			.addForeignKeyConstraint(
				"agent_thread_[userId]_fk",
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
			CREATE INDEX "agent_thread_[userId-archivedAt-updatedAt]_idx"
			ON "agent_thread" ("userId", "archivedAt", "updatedAt" DESC);
		`.execute(db);
	},
};
