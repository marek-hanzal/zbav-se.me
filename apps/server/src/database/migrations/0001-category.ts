import { genId } from "@use-pico/common";
import type { Migration } from "kysely";
import categoriesCsData from "./0001-category/categories.cs.json";

type CategorySeed = {
	name: string;
	slug: string;
	locale: string;
};

export const CategoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("slug", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("category_[slug-locale]_unique_idx")
			.on("category")
			.columns([
				"slug",
				"locale",
			])
			.unique()
			.execute();

		await db
			.insertInto("category")
			.values(
				categoriesCsData.map(
					(category: CategorySeed, index: number) =>
						({
							id: genId(),
							name: category.name,
							slug: category.slug,
							sort: index,
							locale: category.locale,
						}) as const,
				),
			)
			.execute();
	},
};
