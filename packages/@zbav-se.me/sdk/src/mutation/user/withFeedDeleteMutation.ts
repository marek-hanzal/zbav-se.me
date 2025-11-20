import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedDelete } from "~/api/user/sdk.gen";
import type { apiFeedDeleteError, tApiFeedDeleteResponse, tFeedQuery } from "~/api/user/types.gen";
import { withFeedCollectionQuery } from "~/query/user/withFeedCollectionQuery";
import { withFeedCountQuery } from "~/query/user/withFeedCountQuery";

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
