import { withMutation } from "@use-pico/client/mutation";
import { AxiosError } from "axios";
import { apiListingFlagToggle } from "../../api/session/sdk.gen";
import type {
	tApiListingFlagToggleResponse,
	tListingFlagToggle,
} from "../../api/session/types.gen";
import { withListingMetricsFetchQuery } from "../../query/session/withListingMetricsFetchQuery";

export const withListingFlagToggleMutation = withMutation<
	tListingFlagToggle,
	tApiListingFlagToggleResponse[204]
>({
	keys(variables) {
		return [
			"listing-flag",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return apiListingFlagToggle({
			body,
			throwOnError: true,
		})
			.then((res) => res.data)
			.catch((error) => {
				if (error instanceof AxiosError) {
					throw error.response?.data;
				}
				throw error;
			});
	},
	invalidate: [
		withListingMetricsFetchQuery,
	],
});
