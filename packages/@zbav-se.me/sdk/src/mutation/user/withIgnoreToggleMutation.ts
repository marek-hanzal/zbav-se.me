import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiIgnoreToggle } from "../../api/user/sdk.gen";
import type {
	apiIgnoreToggleError,
	tApiIgnoreToggleResponse,
	tIgnoreToggle,
} from "../../api/user/types.gen";

export const withIgnoreToggleMutation = withMutation<
	tIgnoreToggle,
	tApiIgnoreToggleResponse[204],
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
