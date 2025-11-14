import { type Migration, sql } from "kysely";

export const UserExMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("user_side")
			.asEnum([
				"seller",
				"buyer",
			])
			.execute();

		await db.schema
			.createTable("user_ex")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull().unique())
			.addColumn("locationId", "text")
			.addColumn("side", sql`user_side`)
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

		await db.schema.createIndex("user_ex_[locationId]_idx").on("user_ex").column("locationId").execute();
	},
};
