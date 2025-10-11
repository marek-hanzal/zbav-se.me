import { withQuery } from "@use-pico/client";
import {
	type CategoryQuery,
	type Count,
	postCategoryCount,
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
			return postCategoryCount(data).then((res) => res.data);
		},
	});
};
