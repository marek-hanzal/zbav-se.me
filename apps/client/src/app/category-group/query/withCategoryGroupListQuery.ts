import { withQuery } from "@use-pico/client";
import {
	type CategoryGroup,
	type CategoryGroupQuery,
	postCategoryGroupCollection,
} from "@zbav-se.me/sdk";

export const withCategoryGroupListQuery = () => {
	return withQuery<CategoryGroupQuery, CategoryGroup[]>({
		keys(data) {
			return [
				"category-group",
				"list",
				data,
			];
		},
		async queryFn(data) {
			return postCategoryGroupCollection(data).then((res) => res.data);
		},
	});
};
