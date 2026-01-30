import { withQuery } from "@use-pico/client/query";
import { apiBoardItems } from "../../../api/arkini/sdk.gen";
import type { tApiBoardItemsRequest, tApiBoardItemsResponse } from "../../../api/arkini/types.gen";

export const withBoardItemsQuery = withQuery<
	Partial<tApiBoardItemsRequest>,
	tApiBoardItemsResponse[200]
>({
	keys(_data) {
		return [
			"board",
			"items",
		];
	},
	async queryFn(_data) {
		return apiBoardItems({
			throwOnError: true,
		}).then((res) => res.data);
	},
});
