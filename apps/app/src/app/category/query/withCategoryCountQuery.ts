import { withQuery } from "@use-pico/client";
import {
	apiCategoryCount,
	type tCategoryQuery,
	type tCount,
} from "@zbav-se.me/sdk";

export const withCategoryCountQuery = withQuery<tCategoryQuery, tCount>({
	keys(data) {
		return [
			"category",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiCategoryCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
