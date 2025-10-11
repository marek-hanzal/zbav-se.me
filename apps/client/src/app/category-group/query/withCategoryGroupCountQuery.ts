import { withQuery } from "@use-pico/client";
import {
	type CategoryGroupQuery,
	type Count,
	postCategoryGroupCount,
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
			return postCategoryGroupCount(data).then((res) => res.data);
		},
	});
};
