import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiGalleryFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
