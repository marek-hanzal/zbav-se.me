import type { Migration } from "kysely/migration";

export const PlanStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("plan_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("planId", "text", (col) => col.notNull())
			.addColumn("priceId", "text", (col) => col.notNull())
			.addColumn("url", "text")
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"plan_stripe_[planId]_fk",
				[
					"planId",
				],
				"plan",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("plan_stripe_[priceId]_unique_idx", [
				"priceId",
			])
			.execute();

		await db.schema
			.createIndex("plan_stripe_[planId-createdAt]_idx")
			.on("plan_stripe")
			.columns([
				"planId",
				"createdAt",
			])
			.execute();
	},
};
