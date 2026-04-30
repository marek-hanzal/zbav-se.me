import type { Migration } from "kysely";

export const TranslationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("translation")
			//
			.addColumn("locale", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())
			.addColumn("static", "boolean", (col) => col.notNull())

			.addPrimaryKeyConstraint("translation_[locale-key]_pk", [
				"locale",
				"key",
			])
			.execute();

		await db.schema
			.createIndex("translation_[key]_idx")
			.on("translation")
			.columns([
				"key",
			])
			.execute();
	},
};
