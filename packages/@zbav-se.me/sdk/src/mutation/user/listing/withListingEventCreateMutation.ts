import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingEventCreate } from "../../../api/user/sdk.gen";
import type {
	apiListingEventCreateError,
	tApiListingEventCreateResponse,
	tListingEventCreate,
} from "../../../api/user/types.gen";

export const withListingEventCreateMutation = withMutation<
	tListingEventCreate,
	tApiListingEventCreateResponse[201],
	apiListingEventCreateError
>({
	keys(variables) {
		return [
			"listing-event",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingEventCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
