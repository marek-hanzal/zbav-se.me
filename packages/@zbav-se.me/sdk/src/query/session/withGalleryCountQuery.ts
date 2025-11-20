import { withQuery } from "@use-pico/client/query";
import { apiGalleryCount } from "../../api/session/sdk.gen";
import type { tApiGalleryCountResponse, tGalleryQuery } from "../../api/session/types.gen";

export const withGalleryCountQuery = withQuery<tGalleryQuery, tApiGalleryCountResponse[200]>({
	keys(data) {
		return [
			"gallery",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiGalleryCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
