import type { Migration } from "kysely/migration";

export const StripeEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("stripe_event")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("eventId", "text", (col) => col.notNull())
			.addColumn("type", "text", (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("processedAt", "timestamptz")
			.addUniqueConstraint("stripe_event_[eventId]_unique_idx", [
				"eventId",
			])
			.execute();
	},
};
