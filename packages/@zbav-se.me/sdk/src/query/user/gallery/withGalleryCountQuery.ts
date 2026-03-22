import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiGalleryCount } from "../../../api/user/sdk.gen";
import type { tApiGalleryCountResponse, tGalleryQuery } from "../../../api/user/types.gen";

export const withGalleryCountQuery = withQuery<tGalleryQuery, tApiGalleryCountResponse[200]>({
	keys(data) {
		return [
			"gallery",
			"count",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiGalleryCount({
					body,
					headers,
				}),
			);
		},
	}),
});
