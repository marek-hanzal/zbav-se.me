import { type Migration, sql } from "kysely";

export const AssistantMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("assistant")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addForeignKeyConstraint(
				"assistant_[userId]_fk",
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
			CREATE INDEX "assistant_[userId-createdAt]_idx" ON "assistant" ("userId", "createdAt" DESC);
		`.execute(db);
	},
};
