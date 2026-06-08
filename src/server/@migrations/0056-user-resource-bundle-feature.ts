import type { Migration } from "kysely/migration";

export const UserResourceBundleFeatureMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_feature")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"user_resource_bundle_feature_[userResourceBundleId]_fk",
				[
					"userResourceBundleId",
				],
				"user_resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_resource_bundle_feature_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.execute();

		await db.schema
			.createIndex("user_resource_bundle_feature_[userResourceBundleId]_idx")
			.on("user_resource_bundle_feature")
			.column("userResourceBundleId")
			.execute();

		await db.schema
			.createIndex("user_resource_bundle_feature_[resourceDefinitionId-availableAt]_idx")
			.on("user_resource_bundle_feature")
			.columns([
				"resourceDefinitionId",
				"availableAt",
			])
			.execute();
	},
};
