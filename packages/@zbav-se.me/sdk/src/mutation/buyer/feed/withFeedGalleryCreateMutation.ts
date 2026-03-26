import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedGalleryCreate } from "../../../api/buyer/sdk.gen";
import type {
	apiFeedGalleryCreateError,
	tApiFeedGalleryCreateResponse,
	tFeedGalleryCreate,
} from "../../../api/buyer/types.gen";

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
		{
			async invalidate(queryClient) {
				// await withFeedQuery.invalidator(queryClient, [
				// 	"fetch",
				// 	"collection",
				// ]);
			},
		},
	],
});
