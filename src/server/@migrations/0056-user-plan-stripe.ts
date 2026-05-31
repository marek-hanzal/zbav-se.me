import type { Migration } from "kysely/migration";

export const UserPlanStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_plan_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userPlanId", "text", (col) => col.notNull())
			.addColumn("subscriptionId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"user_plan_stripe_[userPlanId]_fk",
				[
					"userPlanId",
				],
				"user_plan",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("user_plan_stripe_[userPlanId]_unique_idx", [
				"userPlanId",
			])
			.addUniqueConstraint("user_plan_stripe_[subscriptionId]_unique_idx", [
				"subscriptionId",
			])
			.execute();
	},
};
