import { genId } from "@use-pico/common";
import type { Migration } from "kysely";

const generateCategoryGroupSeedData = () => {
	const categoryGroupNames = [
		"electronics",
		"kitchen",
		"garden",
		"home",
		"personal",
		"hobbies",
		"automotive",
		"pets",
		"reality",
		"other",
	];

	return categoryGroupNames.map((name, index) => ({
		id: genId(),
		name,
		sort: index,
	}));
};

const generateCategorySeedData = (categoryGroupMap: Map<string, string>) => {
	const categories = [
		// Electronics
		{
			name: "phone",
			group: "electronics",
		},
		{
			name: "tv",
			group: "electronics",
		},
		{
			name: "laptop",
			group: "electronics",
		},
		{
			name: "desktop",
			group: "electronics",
		},
		{
			name: "tablet",
			group: "electronics",
		},
		{
			name: "watch",
			group: "electronics",
		},

		// Kitchen
		{
			name: "appliances",
			group: "kitchen",
		},
		{
			name: "cookware",
			group: "kitchen",
		},
		{
			name: "dishes",
			group: "kitchen",
		},
		{
			name: "cutlery",
			group: "kitchen",
		},
		{
			name: "bakeware",
			group: "kitchen",
		},
		{
			name: "storage",
			group: "kitchen",
		},
		{
			name: "small-appliances",
			group: "kitchen",
		},
		{
			name: "dining",
			group: "kitchen",
		},

		// Garden
		{
			name: "plants",
			group: "garden",
		},
		{
			name: "seeds",
			group: "garden",
		},
		{
			name: "pots",
			group: "garden",
		},
		{
			name: "tools",
			group: "garden",
		},
		{
			name: "fertilizer",
			group: "garden",
		},
		{
			name: "decorations",
			group: "garden",
		},
		{
			name: "furniture",
			group: "garden",
		},
		{
			name: "lighting",
			group: "garden",
		},

		// Home
		{
			name: "furniture",
			group: "home",
		},
		{
			name: "decor",
			group: "home",
		},
		{
			name: "storage",
			group: "home",
		},
		{
			name: "cleaning",
			group: "home",
		},
		{
			name: "bedding",
			group: "home",
		},
		{
			name: "bathroom",
			group: "home",
		},
		{
			name: "lighting",
			group: "home",
		},
		{
			name: "textiles",
			group: "home",
		},

		// Personal
		{
			name: "clothing",
			group: "personal",
		},
		{
			name: "jewelry",
			group: "personal",
		},
		{
			name: "books",
			group: "personal",
		},
		{
			name: "toys",
			group: "personal",
		},
		{
			name: "accessories",
			group: "personal",
		},
		{
			name: "cosmetics",
			group: "personal",
		},
		{
			name: "bags",
			group: "personal",
		},
		{
			name: "shoes",
			group: "personal",
		},

		// Hobbies
		{
			name: "art",
			group: "hobbies",
		},
		{
			name: "music",
			group: "hobbies",
		},
		{
			name: "sports",
			group: "hobbies",
		},
		{
			name: "crafts",
			group: "hobbies",
		},
		{
			name: "games",
			group: "hobbies",
		},
		{
			name: "collectibles",
			group: "hobbies",
		},
		{
			name: "instruments",
			group: "hobbies",
		},
		{
			name: "equipment",
			group: "hobbies",
		},

		// Automotive
		{
			name: "parts",
			group: "automotive",
		},
		{
			name: "accessories",
			group: "automotive",
		},
		{
			name: "tools",
			group: "automotive",
		},
		{
			name: "maintenance",
			group: "automotive",
		},
		{
			name: "interior",
			group: "automotive",
		},
		{
			name: "exterior",
			group: "automotive",
		},
		{
			name: "electronics",
			group: "automotive",
		},
		{
			name: "wheels",
			group: "automotive",
		},
		{
			name: "wreck",
			group: "automotive",
		},

		// Pets
		{
			name: "dog",
			group: "pets",
		},
		{
			name: "cat",
			group: "pets",
		},
		{
			name: "bird",
			group: "pets",
		},
		{
			name: "fish",
			group: "pets",
		},
		{
			name: "hamster",
			group: "pets",
		},
		{
			name: "rabbit",
			group: "pets",
		},
		{
			name: "reptile",
			group: "pets",
		},
		{
			name: "accessories",
			group: "pets",
		},
		{
			name: "food",
			group: "pets",
		},
		{
			name: "toys",
			group: "pets",
		},
		{
			name: "health",
			group: "pets",
		},
		{
			name: "grooming",
			group: "pets",
		},
		{
			name: "other",
			group: "pets",
		},

		// Reality
		{
			name: "flat-rent",
			group: "reality",
		},
		{
			name: "flat-sell",
			group: "reality",
		},
		{
			name: "house-rent",
			group: "reality",
		},
		{
			name: "house-sell",
			group: "reality",
		},
		{
			name: "commercial-rent",
			group: "reality",
		},
		{
			name: "commercial-sell",
			group: "reality",
		},
		{
			name: "land-rent",
			group: "reality",
		},
		{
			name: "land-sell",
			group: "reality",
		},
		{
			name: "garage-rent",
			group: "reality",
		},
		{
			name: "garage-sell",
			group: "reality",
		},
		{
			name: "parking-rent",
			group: "reality",
		},
		{
			name: "parking-sell",
			group: "reality",
		},
		{
			name: "storage-rent",
			group: "reality",
		},
		{
			name: "storage-sell",
			group: "reality",
		},
		{
			name: "office-rent",
			group: "reality",
		},
		{
			name: "office-sell",
			group: "reality",
		},
		{
			name: "warehouse-rent",
			group: "reality",
		},
		{
			name: "warehouse-sell",
			group: "reality",
		},

		// Other
		{
			name: "other",
			group: "other",
		},
	];

	return categories.map((category, index) => {
		const groupId =
			categoryGroupMap.get(category.group) ||
			categoryGroupMap.get("other");
		if (!groupId) {
			throw new Error(`Category group not found for: ${category.group}`);
		}
		return {
			id: genId(),
			name: category.name,
			sort: index,
			categoryGroupId: groupId,
		};
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
			.execute();

		// Create Category table
		await db.schema
			.createTable("Category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("categoryGroupId", "text", (col) => col.notNull())
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
	},
};
