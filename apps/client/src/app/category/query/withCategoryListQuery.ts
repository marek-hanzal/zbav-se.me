import { withQuery } from "@use-pico/client";
import {
	apiCategoryCollection,
	type Category,
	type CategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryListQuery = () => {
	return withQuery<CategoryQuery, Category[]>({
		keys(data) {
			return [
				"category",
				"list",
				data,
			];
		},
		async queryFn(data) {
			return apiCategoryCollection(data).then((res) => res.data);
		},
	});
};
