import { withQuery } from "@use-pico/client/query";
import { apiCategoryCartCollection } from "../api/session/sdk.gen";
import type {
	tApiCategoryCartCollectionResponse,
	tCategoryQuery,
} from "../api/session/types.gen";

export const withCategoryCartCollectionQuery = withQuery<
	tCategoryQuery,
	tApiCategoryCartCollectionResponse[200]
>({
	keys(variables) {
		return [
			"category",
			"cart",
			"collection",
			variables,
		];
	},
	async queryFn(body) {
		return apiCategoryCartCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
