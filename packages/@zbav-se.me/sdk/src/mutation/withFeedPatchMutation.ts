import { withMutation } from "@use-pico/client/mutation";
import { apiFeedPatch } from "../api/session/sdk.gen";
import type {
	tApiFeedPatchResponse,
	tFeedPatch,
} from "../api/session/types.gen";
import { withFeedCollectionQuery } from "../query/withFeedCollectionQuery";
import { withFeedFetchQuery } from "../query/withFeedFetchQuery";

export const withFeedPatchMutation = withMutation<
	tFeedPatch,
	tApiFeedPatchResponse[200]
>({
	keys(variables) {
		return [
			"feed",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedPatch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCollectionQuery,
		withFeedFetchQuery,
	],
});
