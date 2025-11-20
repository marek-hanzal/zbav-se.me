import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingIgnoreToggle } from "~/api/user/sdk.gen";
import type {
	apiListingIgnoreToggleError,
	tApiListingIgnoreToggleResponse,
	tListingIgnoreToggle,
} from "~/api/user/types.gen";
import { withListingMetricsFetchQuery } from "~/query/user/withListingMetricsFetchQuery";

export const withListingIgnoreToggleMutation = withMutation<
	tListingIgnoreToggle,
	tApiListingIgnoreToggleResponse[204],
	apiListingIgnoreToggleError
>({
	keys(variables) {
		return [
			"listing-ignore",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingIgnoreToggle({
				body,
			}),
		);
	},
	invalidate: [
		withListingMetricsFetchQuery,
	],
});
