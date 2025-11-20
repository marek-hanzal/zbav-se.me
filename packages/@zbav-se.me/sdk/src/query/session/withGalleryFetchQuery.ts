import { withQuery } from "@use-pico/client/query";
import { apiGalleryFetch } from "../../api/session/sdk.gen";
import type { tApiGalleryFetchResponse, tGalleryQuery } from "../../api/session/types.gen";

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
