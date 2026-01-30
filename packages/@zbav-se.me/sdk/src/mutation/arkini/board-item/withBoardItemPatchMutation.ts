import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiBoardItemPatch } from "../../../api/arkini/sdk.gen";
import type {
	apiBoardItemPatchError,
	tApiBoardItemPatchResponse,
	tBoardItemPatch,
} from "../../../api/arkini/types.gen";

export const withBoardItemPatchMutation = withMutation<
	tBoardItemPatch,
	tApiBoardItemPatchResponse[200],
	apiBoardItemPatchError
>({
	keys(variables) {
		return [
			"board-item",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiBoardItemPatch({
				body,
			}),
		);
	},
	invalidate: [],
});
