import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { CategoryDiscoveryEnumSchema } from "~/common/category/enum/CategoryDiscoveryEnumSchema";

export const CategoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("category_discovery_enum")
			.asEnum(
				toEnumGuard<CategoryDiscoveryEnumSchema.Type>()([
					"implicit",
					"explicit",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("group", "text", (col) => col.notNull())
			.addColumn("groupVec", sql`vector(32)`)
			.addColumn("category", "text", (col) => col.notNull())
			.addColumn("categoryVec", sql`vector(32)`)
			.addColumn("categoryGroupVec", sql`vector(32)`)
			.addColumn("slug", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.addColumn("discovery", sql`category_discovery_enum`, (col) => col.notNull())
			.addColumn("restriction", sql`restriction_enum`)
			.addUniqueConstraint("category_[slug-locale]_unique_idx", [
				"slug",
				"locale",
			])
			.addUniqueConstraint("category_[locale-group-category]_unique_idx", [
				"locale",
				"group",
				"category",
			])
			.execute();

		await sql`
            CREATE INDEX "category_[groupVec]_hnsw_cos_idx" ON "category" USING hnsw ("groupVec" vector_cosine_ops);
        `.execute(db);

		await sql`
            CREATE INDEX "category_[categoryVec]_hnsw_cos_idx" ON "category" USING hnsw ("categoryVec" vector_cosine_ops);
        `.execute(db);

		await sql`
            CREATE INDEX "category_[categoryGroupVec]_hnsw_cos_idx" ON "category" USING hnsw ("categoryGroupVec" vector_cosine_ops)
        `.execute(db);

		await sql`
			CREATE INDEX "category_[group]_trgm_idx"
			ON "category"
			USING gin (lower(immutable_unaccent("group")) gin_trgm_ops)
		`.execute(db);

		await sql`
			CREATE INDEX "category_[category]_trgm_idx"
			ON "category"
			USING gin (lower(immutable_unaccent("category")) gin_trgm_ops)
		`.execute(db);
	},
};
