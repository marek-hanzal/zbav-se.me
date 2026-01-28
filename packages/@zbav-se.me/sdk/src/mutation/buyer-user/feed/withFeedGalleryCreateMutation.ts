import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedGalleryCreate } from "../../../api/buyer-user/sdk.gen";
import type {
	apiFeedGalleryCreateError,
	tApiFeedGalleryCreateResponse,
	tFeedGalleryCreate,
} from "../../../api/buyer-user/types.gen";
import { withFeedCollectionQuery } from "../../../query/buyer-user/feed/withFeedCollectionQuery";
import { withFeedFetchQuery } from "../../../query/buyer-user/feed/withFeedFetchQuery";
import { withGalleryFetchQuery } from "../../../query/user/gallery/withGalleryFetchQuery";

export const withFeedGalleryCreateMutation = withMutation<
	tFeedGalleryCreate,
	tApiFeedGalleryCreateResponse[200],
	apiFeedGalleryCreateError
>({
	keys(variables) {
		return [
			"feed-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFeedGalleryCreate({
				body,
			}),
		);
	},
	invalidate: [
		withFeedCollectionQuery,
		withFeedFetchQuery,
		withGalleryFetchQuery,
	],
});
