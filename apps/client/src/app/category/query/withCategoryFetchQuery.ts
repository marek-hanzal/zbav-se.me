import { withQuery } from "@use-pico/client";
import {
	apiCategoryFetch,
	type Category,
	type CategoryQuery,
} from "@zbav-se.me/sdk";

export const withCategoryFetchQuery = () => {
	return withQuery<CategoryQuery, Category>({
		keys(data) {
			return [
				"category",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			return apiCategoryFetch(data).then((res) => res.data);
		},
	});
};
