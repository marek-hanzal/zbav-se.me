import { withMutation } from "@use-pico/client/mutation";
import { apiListingCreate } from "../../api/session/sdk.gen";
import type {
	tApiListingCreateResponse,
	tListingCreate,
} from "../../api/session/types.gen";

export const withListingCreateMutation = withMutation<
	tListingCreate,
	tApiListingCreateResponse[201]
>({
	keys() {
		return [
			"listing",
			"create",
		];
	},
	async mutationFn(body) {
		return apiListingCreate({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
