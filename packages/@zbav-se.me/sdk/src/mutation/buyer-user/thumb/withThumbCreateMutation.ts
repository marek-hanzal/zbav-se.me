import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiThumbCreate } from "../../../api/buyer-user/sdk.gen";
import type {
	apiThumbCreateError,
	tApiThumbCreateResponse,
	tThumbCreate,
} from "../../../api/buyer-user/types.gen";

export const withThumbCreateMutation = withMutation<
	tThumbCreate,
	tApiThumbCreateResponse[201],
	apiThumbCreateError
>({
	keys(variables) {
		return [
			"thumb",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiThumbCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
