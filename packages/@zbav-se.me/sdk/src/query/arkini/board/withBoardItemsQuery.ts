import { withQuery } from "@use-pico/client/query";
import { apiBoardItems } from "../../../api/arkini/sdk.gen";
import type { tApiBoardItemsResponse } from "../../../api/arkini/types.gen";

export const withBoardItemsQuery = withQuery<void, tApiBoardItemsResponse[200]>({
	keys() {
		return [
			"board",
			"items",
		];
	},
	async queryFn() {
		return apiBoardItems({
			throwOnError: true,
		}).then((res) => res.data);
	},
});
