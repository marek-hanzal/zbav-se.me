import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingIgnoreToggle } from "../../api/session/sdk.gen";
import type {
	apiListingIgnoreToggleError,
	tApiListingIgnoreToggleResponse,
	tListingIgnoreToggle,
} from "../../api/session/types.gen";
import { withListingMetricsFetchQuery } from "../../query/session/withListingMetricsFetchQuery";

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
