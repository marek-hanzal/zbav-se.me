import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiCategoryCollection } from "../../../api/session/sdk.gen";
import type {
	tApiCategoryCollectionResponse,
	tCategoryQuery,
} from "../../../api/session/types.gen";

export const withCategoryCollectionQuery = withQuery<
	tCategoryQuery,
	tApiCategoryCollectionResponse[200]
>({
	keys(data) {
		return [
			"category",
			"collection",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiCategoryCollection({
					body,
					headers,
				}),
			);
		},
	}),
});
