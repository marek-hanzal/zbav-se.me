import { type Migration, sql } from "kysely";

export const ListingVendorModelMigration: Migration = {
	async up(db) {
		await db.schema
			.alterTable("listing")
			.addColumn("vendor", "text")
			.addColumn("model", "text")
			.execute();

		await db.schema
			.createIndex("listing_[vendor]_idx")
			.on("listing")
			.using("btree")
			.expression(sql`(lower(vendor)) text_pattern_ops`)
			.where(() => sql`vendor IS NOT NULL`)
			.execute();

		await db.schema
			.createIndex("listing_[model]_idx")
			.on("listing")
			.using("btree")
			.expression(sql`(lower(model)) text_pattern_ops`)
			.where(() => sql`model IS NOT NULL`)
			.execute();

		await db.schema
			.createIndex("listing_[vendor-model]_idx")
			.on("listing")
			.using("btree")
			.expression(sql`(lower(vendor)) text_pattern_ops`)
			.expression(sql`(lower(model)) text_pattern_ops`)
			.where(() => sql`vendor IS NOT NULL AND model IS NOT NULL`)
			.execute();
	},
};
