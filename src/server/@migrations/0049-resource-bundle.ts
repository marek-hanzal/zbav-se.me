import type { Migration } from "kysely/migration";
import { genId } from "@/lib/common/gen-id";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const ResourceBundleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("resource_bundle_[name]_idx")
			.on("resource_bundle")
			.column("name")
			.execute();

		await db
			.insertInto("resource_bundle")
			.values(
				ResourceBundleEnumSchema.options.map((name) => ({
					id: genId(),
					name,
				})),
			)
			.execute();
	},
};
