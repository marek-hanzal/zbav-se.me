import { withQuery } from "@use-pico/client";
import {
	apiCategoryCollection,
	type tCategoryCollection,
	type tCategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryCollectionQuery = withQuery<
	tCategoryQuery,
	tCategoryCollection
>({
	keys(data) {
		return [
			"category",
			"collection",
			data,
		];
	},
	async queryFn(body) {
		return apiCategoryCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
