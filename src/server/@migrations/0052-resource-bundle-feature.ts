import type { Migration } from "kysely/migration";

export const ResourceBundleFeatureMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_feature")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"resource_bundle_feature_[resourceBundleId]_fk",
				[
					"resourceBundleId",
				],
				"resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"resource_bundle_feature_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint(
				"resource_bundle_feature_[resourceBundleId-resourceDefinitionId]_unique_idx",
				[
					"resourceBundleId",
					"resourceDefinitionId",
				],
			)
			.execute();
	},
};
