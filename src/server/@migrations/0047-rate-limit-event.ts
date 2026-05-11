import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const RateLimitEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("rate_limit_event")
			.addColumn("rule", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("window", "timestamptz", (col) => col.notNull())
			.addColumn("count", "integer", (col) => col.notNull())
			.addPrimaryKeyConstraint("rate_limit_event_[rule-key-window]_pk", [
				"rule",
				"key",
				"window",
			])
			.addCheckConstraint("rate_limit_event_[count]_chk", sql`"count" >= 0`)
			.addForeignKeyConstraint(
				"rate_limit_event_[rule]_fk",
				[
					"rule",
				],
				"rate_limit_rule",
				[
					"name",
				],
				(builder) => builder.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("rate_limit_event_[window]_idx")
			.on("rate_limit_event")
			.column("window")
			.execute();

		await db.schema
			.createIndex("rate_limit_event_[rule-window]_idx")
			.on("rate_limit_event")
			.columns([
				"rule",
				"window",
			])
			.execute();
	},
};
