import { withQuery } from "@use-pico/client";
import {
	apiCategoryGroupCount,
	type CategoryGroupQuery,
	type Count,
} from "@zbav-se.me/sdk";

export const withCategoryGroupCountQuery = () => {
	return withQuery<CategoryGroupQuery, Count>({
		keys(data) {
			return [
				"category-group",
				"count",
				data,
			];
		},
		async queryFn(data) {
			return apiCategoryGroupCount(data).then((res) => res.data);
		},
	});
};
