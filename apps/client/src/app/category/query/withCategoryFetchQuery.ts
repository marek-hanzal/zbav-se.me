import { withQuery } from "@use-pico/client";
import {
	type Category,
	type CategoryQuery,
	postCategoryFetch,
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
			return postCategoryFetch(data).then((res) => res.data);
		},
	});
};
