import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedCreate } from "../../../api/buyer-user/sdk.gen";
import type {
	apiFeedCreateError,
	tApiFeedCreateResponse,
	tFeedCreate,
} from "../../../api/buyer-user/types.gen";
import { withFeedCollectionQuery } from "../../../query/buyer-user/feed/withFeedCollectionQuery";
import { withFeedCountQuery } from "../../../query/buyer-user/feed/withFeedCountQuery";

export const withFeedCreateMutation = withMutation<
	tFeedCreate,
	tApiFeedCreateResponse[201],
	apiFeedCreateError
>({
	keys(variables) {
		return [
			"feed",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFeedCreate({
				body,
			}),
		);
	},
	invalidate: [
		withFeedCountQuery,
		withFeedCollectionQuery,
	],
});
