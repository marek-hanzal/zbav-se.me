import { withMutation } from "@use-pico/client/mutation";
import { apiFeedDelete } from "../api/session/sdk.gen";
import type {
	tApiFeedDeleteResponse,
	tFeedQuery,
} from "../api/session/types.gen";
import { withFeedCollectionQuery } from "../query/withFeedCollectionQuery";
import { withFeedCountQuery } from "../query/withFeedCountQuery";

export const withFeedDeleteMutation = withMutation<
	tFeedQuery,
	tApiFeedDeleteResponse[200]
>({
	keys(variables) {
		return [
			"feed",
			"delete",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedDelete({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCountQuery,
		withFeedCollectionQuery,
	],
});
