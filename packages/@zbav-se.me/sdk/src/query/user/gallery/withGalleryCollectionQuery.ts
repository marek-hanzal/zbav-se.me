import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiGalleryCollection } from "../../../api/user/sdk.gen";
import type { tApiGalleryCollectionResponse, tGalleryQuery } from "../../../api/user/types.gen";

export const withGalleryCollectionQuery = withQuery<
	tGalleryQuery,
	tApiGalleryCollectionResponse[200]
>({
	keys(data) {
		return [
			"gallery",
			"collection",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiGalleryCollection({
					body,
					headers,
				}),
			);
		},
	}),
});
