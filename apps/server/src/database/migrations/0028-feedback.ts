import { type Migration, sql } from "kysely";

export const FeedbackMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("feedback_enum")
			.asEnum([
				"like",
				"dislike",
			])
			.execute();

		await db.schema
			.createTable("feedback")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("type", sql`feedback_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"feedback_[userId]_fk",
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
				"feedback_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("feedback_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("feedback_[userId]_idx")
			.on("feedback")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("feedback_[listingId]_idx")
			.on("feedback")
			.column("listingId")
			.execute();

		await db.schema.createIndex("feedback_[type]_idx").on("feedback").column("type").execute();

		await db.schema
			.createIndex("feedback_[createdAt]_idx")
			.on("feedback")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("feedback_[userId-createdAt]_idx")
			.on("feedback")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
