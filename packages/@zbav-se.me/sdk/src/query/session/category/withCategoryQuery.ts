import { withEntityQuery } from "@use-pico/client/query";
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
	async fetch(data) {
		return withApi(
			apiCategoryFetch({
				body: data,
			}),
		);
	},
	async collection(data) {
		return withApi(
			apiCategoryCollection({
				body: data,
			}),
		);
	},
	async count(data) {
		return withApi(
			apiCategoryCount({
				body: data,
			}),
		);
	},
	async create(_data) {
		throw new Error("Category create is not supported.");
	},
	async delete(_data) {
		throw new Error("Category delete is not supported.");
	},
	async patch(_data) {
		throw new Error("Category patch is not supported.");
	},
});
