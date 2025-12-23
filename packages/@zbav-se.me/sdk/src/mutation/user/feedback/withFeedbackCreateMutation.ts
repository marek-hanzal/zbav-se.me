import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedbackCreate } from "../../../api/user/sdk.gen";
import type {
	apiFeedbackCreateError,
	tApiFeedbackCreateResponse,
	tFeedbackCreate,
} from "../../../api/user/types.gen";

export const withFeedbackCreateMutation = withMutation<
	tFeedbackCreate,
	tApiFeedbackCreateResponse[201],
	apiFeedbackCreateError
>({
	keys(variables) {
		return [
			"feedback",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFeedbackCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
