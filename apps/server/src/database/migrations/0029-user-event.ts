import { type Migration, sql } from "kysely";

export const UserEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("user_event_side_enum")
			.asEnum([
				"user",
				"foreign",
			])
			.execute();

		await db.schema
			.createTable("user_event")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("side", sql`user_event_side_enum`, (col) => col.notNull())
			.addColumn("source", "text", (col) => col.notNull())
			.addColumn("group", "text", (col) => col.notNull())
			.addColumn("event", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"user_event_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();
	},
};
