import { genId } from "@use-pico/common";
import type { Migration } from "kysely";
import categoriesCsData from "./0001-category/categories.cs.json";

export const CategorySeedMigration: Migration = {
	async up(db) {
		const categoryIds = await db
			.insertInto("category")
			.values(
				categoriesCsData.map(
					(category, index) =>
						({
							id: genId(),
							group: category.group,
							category: category.category,
							slug: category.slug,
							sort: index,
							locale: category.locale,
						}) as const,
				),
			)
			.returning("id")
			.execute();

		const categoryMap = new Map<string, string>();
		categoryIds.forEach((category, index) => {
			const categoryData = categoriesCsData[index];
			if (categoryData) {
				categoryMap.set(categoryData.slug, category.id);
			}
		});

		const spotlightData = categoriesCsData
			.filter(
				(category) =>
					category.spotlight && category.spotlight.length > 0,
			)
			.flatMap((category) => {
				const categoryId = categoryMap.get(category.slug);
				if (!categoryId) {
					return [];
				}

				return category.spotlight.map((text, weight) => ({
					id: genId(),
					categoryId,
					text,
					locale: category.locale,
					weight: weight + 1,
				}));
			});

		if (spotlightData.length > 0) {
			await db
				.insertInto("category_spotlight")
				.values(spotlightData)
				.execute();
		}
	},
};
