import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingFlagToggle } from "../../api/session/sdk.gen";
import type {
	apiListingFlagToggleError,
	tApiListingFlagToggleResponse,
	tListingFlagToggle,
} from "../../api/session/types.gen";
import { withListingMetricsFetchQuery } from "../../query/session/withListingMetricsFetchQuery";

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
