import { withQuery } from "@use-pico/client/query";
import { apiCategoryCount } from "~/api/session/sdk.gen";
import type { tApiCategoryCountResponse, tCategoryQuery } from "~/api/session/types.gen";

export const withCategoryCountQuery = withQuery<tCategoryQuery, tApiCategoryCountResponse[200]>({
	keys(data) {
		return [
			"category",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiCategoryCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
