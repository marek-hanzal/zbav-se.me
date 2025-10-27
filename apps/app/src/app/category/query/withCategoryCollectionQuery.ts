import { withQuery } from "@use-pico/client";
import {
	apiCategoryCollection,
	type Category,
	type CategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryCollectionQuery = () => {
	return withQuery<CategoryQuery, Category[]>({
		keys(data) {
			return [
				"category",
				"collection",
				data,
			];
		},
		async queryFn(data) {
			return apiCategoryCollection(data).then((res) => res.data);
		},
	});
};
