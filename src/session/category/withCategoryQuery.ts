import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { categoryCollectionFn } from "~/session/category/fn/categoryCollectionFn";
import { categoryCountFn } from "~/session/category/fn/categoryCountFn";
import { categoryFetchFn } from "~/session/category/fn/categoryFetchFn";
import type { CategoryCountQuerySchema } from "~/session/category/server/schema/CategoryCountQuerySchema";
import type { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import type { CategorySchema } from "~/session/category/server/schema/CategorySchema";

const logger = getRootLogger([
	"query",
	"withCategoryQuery",
]);

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
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return categoryFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return categoryCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return categoryCountFn({
			data,
		});
	},
	async createFn(_data, _context) {
		throw new Error("Category create is not supported.");
	},
	async deleteFn(_data, _context) {
		throw new Error("Category delete is not supported.");
	},
	async patchFn(_data, _context) {
		throw new Error("Category patch is not supported.");
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Category collection patch is not supported.");
	},
});
