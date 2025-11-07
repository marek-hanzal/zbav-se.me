import { withMutation } from "@use-pico/client/mutation";
import { AxiosError } from "axios";
import { apiListingScoreCreate } from "../api/session/sdk.gen";
import type {
	tApiListingScoreCreateResponse,
	tListingScoreCreate,
} from "../api/session/types.gen";

export const withListingScoreCreateMutation = withMutation<
	tListingScoreCreate,
	tApiListingScoreCreateResponse[201]
>({
	keys(variables) {
		return [
			"listing-score",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return apiListingScoreCreate({
			body,
			throwOnError: true,
		})
			.then((res) => res.data)
			.catch((e) => {
				if (e instanceof AxiosError) {
					throw e.response?.data;
				}
				throw e;
			});
	},
});
