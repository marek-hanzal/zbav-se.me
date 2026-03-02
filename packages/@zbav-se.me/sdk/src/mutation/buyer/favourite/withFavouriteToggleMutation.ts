import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFavouriteToggle } from "../../../api/buyer/sdk.gen";
import type {
	apiFavouriteToggleError,
	tApiFavouriteToggleResponse,
	tFavouriteToggle,
} from "../../../api/buyer/types.gen";

export const withFavouriteToggleMutation = withMutation<
	tFavouriteToggle,
	tApiFavouriteToggleResponse[200],
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
