import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFlagToggle } from "../../../api/user/sdk.gen";
import type {
	apiFlagToggleError,
	tApiFlagToggleResponse,
	tFlagToggle,
} from "../../../api/user/types.gen";

export const withFlagToggleMutation = withMutation<
	tFlagToggle,
	tApiFlagToggleResponse[200],
	apiFlagToggleError
>({
	keys(variables) {
		return [
			"flag",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFlagToggle({
				body,
			}),
		);
	},
	invalidate: [],
});
