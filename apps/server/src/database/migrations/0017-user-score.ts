import { type Migration, sql } from "kysely";

export const UserScoreMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("user_score_type")
			.asEnum([
				"communication",
				"trust",
				"reliability",
				"speed",
			])
			.execute();

		await db.schema
			.createTable("user_score")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("fromUserId", "text", (col) => col.notNull())
			.addColumn("toUserId", "text", (col) => col.notNull())
			.addColumn("score", "integer", (col) => col.notNull())
			.addColumn("type", sql`user_score_type`, (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"user_score_[fromUserId]_fk",
				[
					"fromUserId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_score_[toUserId]_fk",
				[
					"toUserId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("user_score_[fromUserId]_idx")
			.on("user_score")
			.column("fromUserId")
			.execute();

		await db.schema
			.createIndex("user_score_[toUserId]_idx")
			.on("user_score")
			.column("toUserId")
			.execute();

		await db.schema
			.createIndex("user_score_[createdAt]_idx")
			.on("user_score")
			.column("createdAt")
			.execute();
	},
};
