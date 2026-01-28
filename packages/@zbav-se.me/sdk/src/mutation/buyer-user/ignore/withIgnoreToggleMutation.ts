import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiIgnoreToggle } from "../../../api/buyer-user/sdk.gen";
import type {
	apiIgnoreToggleError,
	tApiIgnoreToggleResponse,
	tIgnoreToggle,
} from "../../../api/buyer-user/types.gen";

export const withIgnoreToggleMutation = withMutation<
	tIgnoreToggle,
	tApiIgnoreToggleResponse[200],
	apiIgnoreToggleError
>({
	keys(variables) {
		return [
			"ignore",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiIgnoreToggle({
				body,
			}),
		);
	},
	invalidate: [],
});
