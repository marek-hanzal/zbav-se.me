import type { Migration } from "kysely/migration";

export const PlanMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("plan")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("url", "text")
			.addUniqueConstraint("plan_[name]_unique_idx", [
				"name",
			])
			.execute();
	},
};
