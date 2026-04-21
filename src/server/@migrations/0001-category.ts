import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { CategoryTypeEnumSchema } from "~/common/category/enum/CategoryTypeEnumSchema";

export const CategoryMigration: Migration = {
	async up(db) {
		await sql`CREATE EXTENSION IF NOT EXISTS vector;`.execute(db);

		await db.schema
			.createType("category_restriction_enum")
			.asEnum(
				toEnumGuard<CategoryRestrictionEnumSchema.Type>()([
					"none",
					"adult",
					"adult-relaxed",
					"sensitive",
					"restricted",
				] as const),
			)
			.execute();

		await db.schema
			.createType("category_type_enum")
			.asEnum(
				toEnumGuard<CategoryTypeEnumSchema.Type>()([
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
			.addColumn("type", sql`category_type_enum`, (col) => col.notNull())
			.addColumn("restrictions", sql`category_restriction_enum[]`)
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
	},
};
