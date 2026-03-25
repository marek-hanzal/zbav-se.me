import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiCategoryCollection,
	apiCategoryCount,
	apiCategoryFetch,
	type tCategory,
	type tCategoryCountQuery,
	type tCategoryQuery,
} from "../../../api/session";

export const withCategoryQuery = withEntityQuery<
	tCategory,
	tCategoryQuery,
	tCategoryQuery,
	tCategoryCountQuery,
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
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiCategoryFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiCategoryCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiCategoryCount({
					body: request,
					headers,
				}),
			);
		},
	}),
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
