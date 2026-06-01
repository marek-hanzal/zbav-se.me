import type { Migration } from "kysely/migration";

export const ResourceBundleStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleId", "text", (col) => col.notNull())
			.addColumn("priceId", "text", (col) => col.notNull())
			.addColumn("url", "text")
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"resource_bundle_stripe_[resourceBundleId]_fk",
				[
					"resourceBundleId",
				],
				"resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("resource_bundle_stripe_[priceId]_unique_idx", [
				"priceId",
			])
			.execute();

		await db.schema
			.createIndex("resource_bundle_stripe_[resourceBundleId-createdAt]_idx")
			.on("resource_bundle_stripe")
			.columns([
				"resourceBundleId",
				"createdAt",
			])
			.execute();
	},
};
