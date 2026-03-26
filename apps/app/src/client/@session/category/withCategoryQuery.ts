import { withEntityQuery } from "@use-pico/client/query";
import { categoryCollectionFn } from "~/server/@session/category/fn/categoryCollectionFn";
import { categoryCountFn } from "~/server/@session/category/fn/categoryCountFn";
import { categoryFetchFn } from "~/server/@session/category/fn/categoryFetchFn";
import type { CategoryCountQuerySchema } from "~/server/@session/category/schema/CategoryCountQuerySchema";
import type { CategoryQuerySchema } from "~/server/@session/category/schema/CategoryQuerySchema";
import type { CategorySchema } from "~/server/@session/category/schema/CategorySchema";

export const withCategoryQuery = withEntityQuery<
	CategorySchema.Type,
	CategoryQuerySchema.Type,
	CategoryQuerySchema.Type,
	CategoryCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"category",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return categoryFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return categoryCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return categoryCountFn({
			data,
		});
	},
	async createFn(_data) {
		throw new Error("Category create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Category delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Category patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Category collection patch is not supported.");
	},
});
