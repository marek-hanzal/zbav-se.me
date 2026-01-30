import { withQuery } from "@use-pico/client/query";
import { apiBoardItemFetch } from "../../../api/arkini/sdk.gen";
import type { tApiBoardItemFetchResponse, tBoardItemQuery } from "../../../api/arkini/types.gen";

export const withBoardItemFetchQuery = withQuery<tBoardItemQuery, tApiBoardItemFetchResponse[200]>({
	keys(data) {
		return [
			"board-item",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiBoardItemFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
