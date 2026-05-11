import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const RateLimitRuleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("rate_limit_rule")
			.addColumn("name", "text", (col) => col.primaryKey().notNull())
			.addColumn("window", "integer", (col) => col.notNull())
			.addColumn("limit", "numeric", (col) => col.notNull())
			.addCheckConstraint("rate_limit_rule_[window]_chk", sql`"window" > 0`)
			.addCheckConstraint("rate_limit_rule_[limit]_chk", sql`"limit" >= 0`)
			.execute();
	},
};
