import type { Migration } from "kysely/migration";

export const UserPlanMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_plan")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("planId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"user_plan_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_plan_[planId]_fk",
				[
					"planId",
				],
				"plan",
				[
					"id",
				],
			)
			.addUniqueConstraint("user_plan_[userId-planId]_unique_idx", [
				"userId",
				"planId",
			])
			.execute();

		await db.schema
			.createIndex("user_plan_[userId-availableAt]_idx")
			.on("user_plan")
			.columns([
				"userId",
				"availableAt",
			])
			.execute();

		await db.schema
			.createIndex("user_plan_[planId]_idx")
			.on("user_plan")
			.column("planId")
			.execute();

		await db.schema
			.createIndex("user_plan_[userId-createdAt]_idx")
			.on("user_plan")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
