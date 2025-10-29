import { withQuery } from "@use-pico/client";
import {
	apiCategoryCollection,
	type CategoryCollection,
	type CategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryCollectionQuery = () => {
	return withQuery<CategoryQuery, CategoryCollection>({
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
