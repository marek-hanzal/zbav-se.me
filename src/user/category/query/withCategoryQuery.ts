import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { categoryCollectionFn } from "~/user/category/fn/categoryCollectionFn";
import { categoryCountFn } from "~/user/category/fn/categoryCountFn";
import { categoryFetchFn } from "~/user/category/fn/categoryFetchFn";
import type { CategoryCountQuerySchema } from "~/user/category/server/schema/CategoryCountQuerySchema";
import type { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";

export const withCategoryQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withCategoryQuery",
	]),
	errors: {} as {
		fetch: categoryFetchFn.Error;
		collection: categoryCollectionFn.Error;
		count: categoryCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"category",
		];
	},
	toIdKey(id): CategoryQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: CategoryQuerySchema.Type) {
		return categoryFetchFn({
			data,
		});
	},
	async collectionFn(data: CategoryQuerySchema.Type) {
		return categoryCollectionFn({
			data,
		});
	},
	async countFn(data: CategoryCountQuerySchema.Type) {
		return categoryCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<CategorySchema.Type> {
		throw new Error("Category create is not supported.");
	},
	async deleteFn(_data: never): Promise<CategorySchema.Type> {
		throw new Error("Category delete is not supported.");
	},
	async patchFn(_data: never): Promise<CategorySchema.Type> {
		throw new Error("Category patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<CategorySchema.Type[]> {
		throw new Error("Category collection patch is not supported.");
	},
});
