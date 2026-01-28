import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftGalleryCreate } from "../../../api/seller-user/sdk.gen";
import type {
	apiDraftGalleryCreateError,
	tApiDraftGalleryCreateResponse,
	tDraftGalleryCreate,
} from "../../../api/seller-user/types.gen";

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
	invalidate: [],
});
