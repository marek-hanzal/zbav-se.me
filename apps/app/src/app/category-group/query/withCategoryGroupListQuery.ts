import { withQuery } from "@use-pico/client";
import {
	apiCategoryGroupCollection,
	type CategoryGroup,
	type CategoryGroupQuery,
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
			return apiCategoryGroupCollection(data).then((res) => res.data);
		},
	});
};
