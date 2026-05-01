import type { Migration } from "kysely";

export const GitHubMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("github")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("sha", "text", (col) => col.notNull())
			.addColumn("date", "timestamptz", (col) => col.notNull())
			.addColumn("message", "text", (col) => col.notNull())
			.execute();

		await db.schema.createIndex("github_[sha]_idx").on("github").column("sha").execute();

		await db.schema.createIndex("github_[date]_idx").on("github").column("date").execute();
	},
};
