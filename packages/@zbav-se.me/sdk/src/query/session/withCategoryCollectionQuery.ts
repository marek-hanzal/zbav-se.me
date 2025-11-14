import { withQuery } from "@use-pico/client/query";
import { apiCategoryCollection } from "../../api/session/sdk.gen";
import type { tApiCategoryCollectionResponse, tCategoryQuery } from "../../api/session/types.gen";

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
	async queryFn(body) {
		return apiCategoryCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
