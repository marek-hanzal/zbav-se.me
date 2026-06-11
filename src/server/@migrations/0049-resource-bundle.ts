import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { genId } from "@/lib/common/gen-id";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { ResourceBundleTypeEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleTypeEnumSchema";
import { bundles } from "./0049-resource-bundle/bundles";

export const ResourceBundleMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("resource_bundle_type_enum")
			.asEnum(
				toEnumGuard<ResourceBundleTypeEnumSchema.Type>()([
					"subscription",
					"one-off",
					"user",
					"promo",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("resource_bundle")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("type", sql`resource_bundle_type_enum`, (col) => col.notNull())
			.addUniqueConstraint("resource_bundle_[name]_uniq", [
				"name",
			])
			.execute();

		await db.schema
			.createIndex("resource_bundle_[type]_idx")
			.on("resource_bundle")
			.column("type")
			.execute();

		await db
			.insertInto("resource_bundle")
			.values(
				ResourceBundleEnumSchema.options.map((name) => ({
					id: genId(),
					name,
					type: bundles[name].type,
				})),
			)
			.execute();
	},
};
