import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { categoryCollectionFn } from "~/session/category/fn/categoryCollectionFn";
import { categoryCountFn } from "~/session/category/fn/categoryCountFn";
import { categoryFetchFn } from "~/session/category/fn/categoryFetchFn";
import type { CategoryCountQuerySchema } from "~/session/category/server/schema/CategoryCountQuerySchema";
import type { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import type { CategorySchema } from "~/session/category/server/schema/CategorySchema";

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
	logger: getRootLogger([
		"query",
		"withCategoryQuery",
	]),
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
