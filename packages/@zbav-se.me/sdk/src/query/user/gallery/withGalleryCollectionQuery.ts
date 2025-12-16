import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiGalleryCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
