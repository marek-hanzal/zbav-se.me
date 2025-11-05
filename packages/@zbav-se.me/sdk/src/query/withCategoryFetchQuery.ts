import { withQuery } from "@use-pico/client/query";
import { apiCategoryFetch } from "../api/session/sdk.gen";
import type {
	tApiCategoryFetchResponse,
	tCategoryQuery,
} from "../api/session/types.gen";

export const withCategoryFetchQuery = withQuery<
	tCategoryQuery,
	tApiCategoryFetchResponse[200]
>({
	keys(data) {
		return [
			"category",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiCategoryFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
