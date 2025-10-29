import type { Migration } from "kysely";

export const FeedNameMigration: Migration = {
	async up(db) {
		await db.schema
			.alterTable("feed")
			.addColumn("name", "text", (col) => col.notNull())
			.execute();

		await db.schema
			.alterTable("feed")
			.addUniqueConstraint("feed_[userId_name]_unique", [
				"userId",
				"name",
			])
			.execute();
	},
};
