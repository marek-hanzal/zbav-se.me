import { withMutation } from "@use-pico/client/mutation";
import { AxiosError } from "axios";
import { apiListingIgnoreToggle } from "../api/session/sdk.gen";
import type {
	tApiListingIgnoreToggleResponse,
	tListingIgnoreToggle,
} from "../api/session/types.gen";

export const withListingIgnoreToggleMutation = withMutation<
	tListingIgnoreToggle,
	tApiListingIgnoreToggleResponse[204]
>({
	keys(variables) {
		return [
			"listing-ignore",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return apiListingIgnoreToggle({
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
});
