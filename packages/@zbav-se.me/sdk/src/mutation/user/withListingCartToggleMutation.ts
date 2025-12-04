import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingCartToggle } from "../../api/user/sdk.gen";
import type {
	apiListingCartToggleError,
	tApiListingCartToggleResponse,
	tListingCartToggle,
} from "../../api/user/types.gen";
import { withListingCartCountQuery } from "../../query/user/withListingCartCountQuery";
import { withListingFetchQuery } from "../../query/user/withListingFetchQuery";
import { withListingMetricsFetchQuery } from "../../query/user/withListingMetricsFetchQuery";

export const withListingCartToggleMutation = withMutation<
	tListingCartToggle,
	tApiListingCartToggleResponse[204],
	apiListingCartToggleError
>({
	keys(variables) {
		return [
			"listing-cart",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingCartToggle({
				body,
			}),
		);
	},
	invalidate: [
		withListingMetricsFetchQuery,
		withListingCartCountQuery,
		withListingFetchQuery,
	],
});
