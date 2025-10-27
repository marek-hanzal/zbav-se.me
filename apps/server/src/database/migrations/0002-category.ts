import { genId } from "@use-pico/common";
import type { Migration } from "kysely";
import categoriesCsData from "./0002-category/categories.cs.json";

// Types for JSON imports
type CategorySeed = {
	name: string;
	group: string;
	locale: string;
};

const generateCategorySeedData = (categoryGroupMap: Map<string, string>) => {
	const allCategories = [
		...categoriesCsData,
	];
	return allCategories.map((category: CategorySeed, index: number) => {
		const groupId = categoryGroupMap.get(category.group);

		if (!groupId) {
			throw new Error(`Category group not found for: ${category.group}`);
		}

		return {
			id: genId(),
			name: category.name,
			sort: index,
			categoryGroupId: groupId,
			locale: category.locale,
		} as const;
	});
};

export const CategoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("categoryGroupId", "text", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.addForeignKeyConstraint(
				"category_categoryGroupId_fk",
				[
					"categoryGroupId",
				],
				"category_group",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("category_[name-locale-categoryGroupId]_unique_idx")
			.on("category")
			.columns([
				"name",
				"locale",
				"categoryGroupId",
			])
			.unique()
			.execute();

		const insertedCategoryGroups = await db
			.selectFrom("category_group")
			.selectAll()
			.execute();

		const categoryGroupMap = new Map<string, string>();
		insertedCategoryGroups.forEach((group) => {
			categoryGroupMap.set(group.name, group.id);
		});

		await db
			.insertInto("category")
			.values(generateCategorySeedData(categoryGroupMap))
			.execute();
	},
};
