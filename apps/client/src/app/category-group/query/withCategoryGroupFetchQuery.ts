import { withQuery } from "@use-pico/client";
import type { CategoryGroup, CategoryGroupQuery } from "@zbav-se.me/sdk";

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
			throw new Error("Not implemented");
		},
	});
};
