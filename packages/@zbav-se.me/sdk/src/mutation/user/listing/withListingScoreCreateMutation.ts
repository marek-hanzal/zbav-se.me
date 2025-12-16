import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingScoreCreate } from "../../../api/user/sdk.gen";
import type {
	apiListingScoreCreateError,
	tApiListingScoreCreateResponse,
	tListingScoreCreate,
} from "../../../api/user/types.gen";

export const withListingScoreCreateMutation = withMutation<
	tListingScoreCreate,
	tApiListingScoreCreateResponse[201],
	apiListingScoreCreateError
>({
	keys(variables) {
		return [
			"listing-score",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingScoreCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
