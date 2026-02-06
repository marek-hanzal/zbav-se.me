import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiBoardSave } from "../../../api/arkini/sdk.gen";
import type {
	apiBoardSaveError,
	tApiBoardSaveResponse,
	tBoardItem,
} from "../../../api/arkini/types.gen";
import { withBoardItemsQuery } from "../../../query/arkini/board/withBoardItemsQuery";

export const withBoardSaveMutation = withMutation<
	tBoardItem[],
	tApiBoardSaveResponse[200],
	apiBoardSaveError
>({
	keys(variables) {
		return [
			"board",
			"save",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiBoardSave({
				body,
			}),
		);
	},
	invalidate: [
		withBoardItemsQuery,
	],
});
