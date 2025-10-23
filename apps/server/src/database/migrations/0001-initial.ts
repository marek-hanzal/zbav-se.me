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
		// Create category_group table
		await db.schema
			.createTable("category_group")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		// Create unique index for category_group [name, locale]
		await db.schema
			.createIndex("category_group_[name-locale]_unique_idx")
			.on("category_group")
			.columns([
				"name",
				"locale",
			])
			.unique()
			.execute();

		// Create category table
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

		// Create unique index for category [name, locale, categoryGroupId]
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

		// Insert category_group seed data and get the inserted rows
		const categoryGroupData = generateCategoryGroupSeedData();
		const insertedCategoryGroups = await db
			.insertInto("category_group")
			.values(categoryGroupData)
			.returningAll()
			.execute();

		// Create a map of group names to IDs
		const categoryGroupMap = new Map<string, string>();
		insertedCategoryGroups.forEach((group) => {
			categoryGroupMap.set(group.name, group.id);
		});

		// Insert category seed data with proper group assignments
		await db
			.insertInto("category")
			.values(generateCategorySeedData(categoryGroupMap))
			.execute();

		await db.schema
			.createTable("location")
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
			.createIndex("location_[query-lang]_idx")
			.on("location")
			.columns([
				"query",
				"lang",
			])
			.execute();

		await db.schema
			.createIndex("location_[lang-hash]_unique_idx")
			.on("location")
			.columns([
				"lang",
				"hash",
			])
			.unique()
			.execute();

		// Create listing table
		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("currency", "varchar(3)", (col) => col.notNull())
			.addColumn("condition", "integer", (col) => col.notNull())
			.addColumn("age", "integer", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("categoryGroupId", "text", (col) => col.notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("expiresAt", "timestamp", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addColumn("updatedAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"listing_userId_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_locationId_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_categoryGroupId_fk",
				[
					"categoryGroupId",
				],
				"category_group",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_categoryId_fk",
				[
					"categoryId",
				],
				"category",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		// Create index for userId
		await db.schema
			.createIndex("listing_userId_idx")
			.on("listing")
			.column("userId")
			.execute();

		// Create foreign key constraint for location
		await db.schema
			.createIndex("listing_locationId_idx")
			.on("listing")
			.column("locationId")
			.execute();

		// Create index for category group
		await db.schema
			.createIndex("listing_categoryGroupId_idx")
			.on("listing")
			.column("categoryGroupId")
			.execute();

		// Create index for category
		await db.schema
			.createIndex("listing_categoryId_idx")
			.on("listing")
			.column("categoryId")
			.execute();

		// Create index for created date
		await db.schema
			.createIndex("listing_createdAt_idx")
			.on("listing")
			.column("createdAt")
			.execute();

		// Create index for expiration date
		await db.schema
			.createIndex("listing_expiresAt_idx")
			.on("listing")
			.column("expiresAt")
			.execute();

		// Create gallery table
		await db.schema
			.createTable("gallery")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("url", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addColumn("updatedAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"gallery_userId_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"gallery_listingId_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("gallery_userId_idx")
			.on("gallery")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("gallery_listingId_idx")
			.on("gallery")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("gallery_createdAt_idx")
			.on("gallery")
			.column("createdAt")
			.execute();
	},
};
