import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiCategoryFetch } from "../../../api/session/sdk.gen";
import type { tApiCategoryFetchResponse, tCategoryQuery } from "../../../api/session/types.gen";

export const withCategoryFetchQuery = withQuery<tCategoryQuery, tApiCategoryFetchResponse[200]>({
	keys(data) {
		return [
			"category",
			"fetch",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiCategoryFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
