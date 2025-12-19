import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftCreate } from "../../../api/user/sdk.gen";
import type {
	apiDraftCreateError,
	tApiDraftCreateResponse,
	tDraftCreate,
} from "../../../api/user/types.gen";

export const withDraftCreateMutation = withMutation<
	tDraftCreate,
	tApiDraftCreateResponse[201],
	apiDraftCreateError
>({
	keys(variables) {
		return [
			"draft",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiDraftCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
