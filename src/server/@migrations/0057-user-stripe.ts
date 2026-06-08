import type { Migration } from "kysely/migration";

export const UserStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("customerId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"user_stripe_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("user_stripe_[userId]_uniq", [
				"userId",
			])
			.addUniqueConstraint("user_stripe_[customerId]_uniq", [
				"customerId",
			])
			.execute();
	},
};
