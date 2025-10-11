import { withQuery } from "@use-pico/client";
import {
	type CategoryGroup,
	type CategoryGroupQuery,
	postCategoryGroupFetch,
} from "@zbav-se.me/sdk";

export const withCategoryGroupFetchQuery = () => {
	return withQuery<CategoryGroupQuery, CategoryGroup>({
		keys(data) {
			return [
				"category-group",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			return postCategoryGroupFetch(data).then((res) => res.data);
		},
	});
};
