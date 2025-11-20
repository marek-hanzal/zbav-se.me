import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingFlagToggle } from "~/api/user/sdk.gen";
import type {
	apiListingFlagToggleError,
	tApiListingFlagToggleResponse,
	tListingFlagToggle,
} from "~/api/user/types.gen";
import { withListingMetricsFetchQuery } from "~/query/user/withListingMetricsFetchQuery";

export const withListingFlagToggleMutation = withMutation<
	tListingFlagToggle,
	tApiListingFlagToggleResponse[204],
	apiListingFlagToggleError
>({
	keys(variables) {
		return [
			"listing-flag",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingFlagToggle({
				body,
			}),
		);
	},
	invalidate: [
		withListingMetricsFetchQuery,
	],
});
