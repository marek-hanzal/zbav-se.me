import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedCreate } from "../../api/session/sdk.gen";
import type { apiFeedCreateError, tApiFeedCreateResponse, tFeedCreate } from "../../api/session/types.gen";
import { withFeedCollectionQuery } from "../../query/session/withFeedCollectionQuery";
import { withFeedCountQuery } from "../../query/session/withFeedCountQuery";

export const withFeedCreateMutation = withMutation<tFeedCreate, tApiFeedCreateResponse[201], apiFeedCreateError>({
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
