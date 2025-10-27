import { genId } from "@use-pico/common";
import type { Migration } from "kysely";
import categoryGroupsCsData from "./0001-category-group/category-groups.cs.json";

// Types for JSON imports
type CategoryGroupSeed = {
	name: string;
	locale: string;
};

const generateCategoryGroupSeedData = () => {
	const allGroups = [
		...categoryGroupsCsData,
	];
	return allGroups.map(
		(group: CategoryGroupSeed, index: number) =>
			({
				id: genId(),
				name: group.name,
				sort: index,
				locale: group.locale,
			}) as const,
	);
};

export const CategoryGroupMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category_group")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("category_group_[name-locale]_unique_idx")
			.on("category_group")
			.columns([
				"name",
				"locale",
			])
			.unique()
			.execute();

		const categoryGroupData = generateCategoryGroupSeedData();
		await db
			.insertInto("category_group")
			.values(categoryGroupData)
			.execute();
	},
};
