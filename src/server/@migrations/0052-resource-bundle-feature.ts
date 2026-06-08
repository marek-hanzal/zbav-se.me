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
				"rbf_[rbId]_fk",
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
				"rbf_[rdId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint("rbf_[rbId-rdId]_uniq", [
				"resourceBundleId",
				"resourceDefinitionId",
			])
			.execute();
	},
};
