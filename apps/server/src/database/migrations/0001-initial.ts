import { genId } from "@use-pico/common";
import type { Migration } from "kysely";
import categoriesCsData from "./0001-initial/categories.cs.json";
import categoryGroupsCsData from "./0001-initial/category-groups.cs.json";

// Types for JSON imports
type CategoryGroupSeed = {
	name: string;
	locale: string;
};

type CategorySeed = {
	name: string;
	group: string;
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

export const InitialMigration: Migration = {
	async up(db) {
		// Create CategoryGroup table
		await db.schema
			.createTable("CategoryGroup")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		// Create unique index for CategoryGroup [name, locale]
		await db.schema
			.createIndex("CategoryGroup_[name-locale]_unique_idx")
			.on("CategoryGroup")
			.columns([
				"name",
				"locale",
			])
			.unique()
			.execute();

		// Create Category table
		await db.schema
			.createTable("Category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("categoryGroupId", "text", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		// Create unique index for Category [name, locale, categoryGroupId]
		await db.schema
			.createIndex("Category_[name-locale-categoryGroupId]_unique_idx")
			.on("Category")
			.columns([
				"name",
				"locale",
				"categoryGroupId",
			])
			.unique()
			.execute();

		// Insert CategoryGroup seed data and get the inserted rows
		const categoryGroupData = generateCategoryGroupSeedData();
		const insertedCategoryGroups = await db
			.insertInto("CategoryGroup")
			.values(categoryGroupData)
			.returningAll()
			.execute();

		// Create a map of group names to IDs
		const categoryGroupMap = new Map<string, string>();
		insertedCategoryGroups.forEach((group) => {
			categoryGroupMap.set(group.name, group.id);
		});

		// Insert Category seed data with proper group assignments
		await db
			.insertInto("Category")
			.values(generateCategorySeedData(categoryGroupMap))
			.execute();

		await db.schema
			.createTable("Location")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("query", "varchar(128)", (col) => col.notNull())
			.addColumn("lang", "varchar(8)", (col) => col.notNull())
			//
			.addColumn("country", "varchar(72)", (col) => col.notNull())
			.addColumn("code", "varchar(8)", (col) => col.notNull())
			.addColumn("county", "varchar(128)")
			.addColumn("municipality", "varchar(128)")
			.addColumn("state", "varchar(128)")
			//
			.addColumn("address", "varchar(255)", (col) => col.notNull())
			//
			.addColumn("confidence", "numeric", (col) => col.notNull())
			//
			.addColumn("hash", "varchar(255)", (col) => col.notNull())
			//
			.addColumn("lat", "decimal(9, 6)", (col) => col.notNull())
			.addColumn("lon", "decimal(10, 6)", (col) => col.notNull())
			//
			.execute();

		// Create composite index for fast exact match lookups
		await db.schema
			.createIndex("Location_[query-lang]_idx")
			.on("Location")
			.columns([
				"query",
				"lang",
			])
			.execute();

		await db.schema
			.createIndex("Location_[lang-hash]_unique_idx")
			.on("Location")
			.columns([
				"lang",
				"hash",
			])
			.unique()
			.execute();

		// Create Listing table
		await db.schema
			.createTable("Listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("condition", "integer", (col) => col.notNull())
			.addColumn("age", "integer", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("categoryGroupId", "text", (col) => col.notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addColumn("updatedAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.execute();

		// Create foreign key constraint for location
		await db.schema
			.createIndex("Listing_locationId_idx")
			.on("Listing")
			.column("locationId")
			.execute();

		// Create index for category group
		await db.schema
			.createIndex("Listing_categoryGroupId_idx")
			.on("Listing")
			.column("categoryGroupId")
			.execute();

		// Create index for category
		await db.schema
			.createIndex("Listing_categoryId_idx")
			.on("Listing")
			.column("categoryId")
			.execute();

		// Create index for created date
		await db.schema
			.createIndex("Listing_createdAt_idx")
			.on("Listing")
			.column("createdAt")
			.execute();
	},
};
