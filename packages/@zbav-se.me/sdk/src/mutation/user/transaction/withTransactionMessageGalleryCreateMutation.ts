import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiMessageCreate } from "../../../api/user/sdk.gen";
import type {
	apiMessageCreateError,
	tApiMessageCreateResponse,
	tTransactionMessageGalleryCreate,
} from "../../../api/user/types.gen";
import { withMessageQuery } from "../../../query/user/message";

export const withTransactionMessageGalleryCreateMutation = withMutation<
	tTransactionMessageGalleryCreate,
	tApiMessageCreateResponse[201],
	apiMessageCreateError
>({
	keys(variables) {
		return [
			"transaction-message-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiMessageCreate({
				body: {
					type: "gallery",
					...body,
				},
			}),
		);
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withMessageQuery.invalidator(queryClient, [
					"collection",
					"count",
				]);
			},
		},
	],
});
