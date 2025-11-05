import { withMutation } from "@use-pico/client/mutation";
import { apiFeedCreate } from "../api/session/sdk.gen";
import type {
	tApiFeedCreateResponse,
	tFeedCreate,
} from "../api/session/types.gen";
import { withFeedCollectionQuery } from "../query/withFeedCollectionQuery";
import { withFeedCountQuery } from "../query/withFeedCountQuery";

export const withFeedCreateMutation = withMutation<
	tFeedCreate,
	tApiFeedCreateResponse[201]
>({
	keys(variables) {
		return [
			"feed",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedCreate({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCountQuery,
		withFeedCollectionQuery,
	],
});
