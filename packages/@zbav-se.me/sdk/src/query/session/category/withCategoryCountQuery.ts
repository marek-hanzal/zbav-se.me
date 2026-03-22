import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiCategoryCount } from "../../../api/session/sdk.gen";
import type { tApiCategoryCountResponse, tCategoryQuery } from "../../../api/session/types.gen";

export const withCategoryCountQuery = withQuery<tCategoryQuery, tApiCategoryCountResponse[200]>({
	keys(data) {
		return [
			"category",
			"count",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiCategoryCount({
					body,
					headers,
				}),
			);
		},
	}),
});
