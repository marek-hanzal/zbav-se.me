import { withQuery } from "@use-pico/client";
import {
	apiCategoryCount,
	type CategoryQuery,
	type Count,
} from "@zbav-se.me/sdk";

export const withCategoryCountQuery = () => {
	return withQuery<CategoryQuery, Count>({
		keys(data) {
			return [
				"category",
				"count",
				data,
			];
		},
		async queryFn(data) {
			return apiCategoryCount(data).then((res) => res.data);
		},
	});
};
