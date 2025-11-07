import { withMutation } from "@use-pico/client/mutation";
import { AxiosError } from "axios";
import { apiListingCartToggle } from "../api/session/sdk.gen";
import type {
	tApiListingCartToggleResponse,
	tListingCartToggle,
} from "../api/session/types.gen";

export const withListingCartToggleMutation = withMutation<
	tListingCartToggle,
	tApiListingCartToggleResponse[204]
>({
	keys(variables) {
		return [
			"listing-cart",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return apiListingCartToggle({
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
