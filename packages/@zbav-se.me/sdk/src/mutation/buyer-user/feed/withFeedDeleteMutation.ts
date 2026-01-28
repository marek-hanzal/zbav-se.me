import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedDelete } from "../../../api/buyer-user/sdk.gen";
import type {
	apiFeedDeleteError,
	tApiFeedDeleteResponse,
	tFeedQuery,
} from "../../../api/buyer-user/types.gen";
import { withFeedCollectionQuery } from "../../../query/buyer-user/feed/withFeedCollectionQuery";
import { withFeedCountQuery } from "../../../query/buyer-user/feed/withFeedCountQuery";

export const withFeedDeleteMutation = withMutation<
	tFeedQuery,
	tApiFeedDeleteResponse[200],
	apiFeedDeleteError
>({
	keys(variables) {
		return [
			"feed",
			"delete",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFeedDelete({
				body,
			}),
		);
	},
	invalidate: [
		withFeedCountQuery,
		withFeedCollectionQuery,
	],
});
