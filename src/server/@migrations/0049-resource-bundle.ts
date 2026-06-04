import type { Migration } from "kysely/migration";
import { genId } from "@/lib/common/gen-id";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const ResourceBundleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addUniqueConstraint("resource_bundle_[name]_unique_idx", [
				"name",
			])
			.execute();

		await db
			.insertInto("resource_bundle")
			.values(
				ResourceBundleEnumSchema.options.map((name) => ({
					id: genId(),
					name,
				})),
			)
			.onConflict((oc) => oc.column("name").doNothing())
			.execute();
	},
};
