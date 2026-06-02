import type { Migration } from "kysely/migration";

export const UserExMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_ex")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull().unique())
			.addColumn("locationId", "text")
			.addForeignKeyConstraint(
				"user_ex_[userId]_fk",
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
				"user_ex_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("user_ex_[userId]_unique_idx", [
				"userId",
			])
			.execute();

		await db.schema
			.createIndex("user_ex_[locationId]_idx")
			.on("user_ex")
			.column("locationId")
			.execute();
	},
};
