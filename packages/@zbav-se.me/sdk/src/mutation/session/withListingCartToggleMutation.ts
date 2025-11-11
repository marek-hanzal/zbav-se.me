import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingCartToggle } from "../../api/session/sdk.gen";
import type {
	apiListingCartToggleError,
	tApiListingCartToggleResponse,
	tListingCartToggle,
} from "../../api/session/types.gen";
import { withCategoryCartCollectionQuery } from "../../query/session";
import { withListingMetricsFetchQuery } from "../../query/session/withListingMetricsFetchQuery";

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
		withCategoryCartCollectionQuery,
	],
});
