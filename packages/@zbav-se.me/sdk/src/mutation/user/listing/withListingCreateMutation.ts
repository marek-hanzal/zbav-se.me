import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingCreate } from "../../../api/user/sdk.gen";
import type {
	apiListingCreateError,
	tApiListingCreateResponse,
	tListingCreate,
} from "../../../api/user/types.gen";

export const withListingCreateMutation = withMutation<
	tListingCreate,
	tApiListingCreateResponse[201],
	apiListingCreateError
>({
	keys() {
		return [
			"listing",
			"create",
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingCreate({
				body,
			}),
		);
	},
});
