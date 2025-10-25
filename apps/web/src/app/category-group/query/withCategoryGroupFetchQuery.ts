import { withQuery } from "@use-pico/client";
import {
	apiCategoryGroupFetch,
	type CategoryGroup,
	type CategoryGroupQuery,
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
			return apiCategoryGroupFetch(data).then((res) => res.data);
		},
	});
};
