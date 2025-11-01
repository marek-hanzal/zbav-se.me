import { withQuery } from "@use-pico/client/query";
import {
	apiCategoryFetch,
	type tCategoryDto,
	type tCategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryFetchQuery = withQuery<tCategoryQuery, tCategoryDto>({
	keys(data) {
		return [
			"category",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiCategoryFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
