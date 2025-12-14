import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFavouriteToggle } from "../../../api/user/sdk.gen";
import type {
	apiFavouriteToggleError,
	tApiFavouriteToggleResponse,
	tFavouriteToggle,
} from "../../../api/user/types.gen";

export const withFavouriteToggleMutation = withMutation<
	tFavouriteToggle,
	tApiFavouriteToggleResponse[204],
	apiFavouriteToggleError
>({
	keys(variables) {
		return [
			"favourite",
			"toggle",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFavouriteToggle({
				body,
			}),
		);
	},
	invalidate: [],
});
