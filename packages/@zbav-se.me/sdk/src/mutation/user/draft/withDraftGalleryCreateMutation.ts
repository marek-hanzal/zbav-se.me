import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftGalleryCreate } from "../../../api/user/sdk.gen";
import type {
	apiDraftGalleryCreateError,
	tApiDraftGalleryCreateResponse,
	tDraftGalleryCreate,
} from "../../../api/user/types.gen";
import { withDraftCollectionQuery } from "../../../query/user/draft/withDraftCollectionQuery";
import { withDraftFetchQuery } from "../../../query/user/draft/withDraftFetchQuery";
import { withGalleryFetchQuery } from "../../../query/user/gallery/withGalleryFetchQuery";

export const withDraftGalleryCreateMutation = withMutation<
	tDraftGalleryCreate,
	tApiDraftGalleryCreateResponse[200],
	apiDraftGalleryCreateError
>({
	keys(variables) {
		return [
			"draft-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiDraftGalleryCreate({
				body,
			}),
		);
	},
	invalidate: [
		withDraftCollectionQuery,
		withDraftFetchQuery,
		withGalleryFetchQuery,
	],
});
