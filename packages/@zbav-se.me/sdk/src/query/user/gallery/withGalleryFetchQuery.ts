import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiGalleryFetch } from "../../../api/user/sdk.gen";
import type { tApiGalleryFetchResponse, tGalleryQuery } from "../../../api/user/types.gen";

export const withGalleryFetchQuery = withQuery<tGalleryQuery, tApiGalleryFetchResponse[200]>({
	keys(data) {
		return [
			"gallery",
			"fetch",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiGalleryFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
