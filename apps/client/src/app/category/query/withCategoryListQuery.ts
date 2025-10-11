import { withQuery } from "@use-pico/client";
import {
	type Category,
	type CategoryQuery,
	postCategoryCollection,
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
			return postCategoryCollection(data).then((res) => res.data);
		},
	});
};
