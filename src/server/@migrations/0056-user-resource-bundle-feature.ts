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
				"urbf_[urbId]_fk",
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
				"urbf_[rdId]_fk",
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
			.createIndex("urbf_[urbId]_idx")
			.on("user_resource_bundle_feature")
			.column("userResourceBundleId")
			.execute();

		await db.schema
			.createIndex("urbf_[rdId-availableAt]_idx")
			.on("user_resource_bundle_feature")
			.columns([
				"resourceDefinitionId",
				"availableAt",
			])
			.execute();
	},
};
