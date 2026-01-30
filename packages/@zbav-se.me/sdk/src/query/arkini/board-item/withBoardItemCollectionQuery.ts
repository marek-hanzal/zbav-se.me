import { withQuery } from "@use-pico/client/query";
import { apiBoardItemCollection } from "../../../api/arkini/sdk.gen";
import type {
	tApiBoardItemCollectionResponse,
	tBoardItemQuery,
} from "../../../api/arkini/types.gen";

export const withBoardItemCollectionQuery = withQuery<
	Partial<tBoardItemQuery>,
	tApiBoardItemCollectionResponse[200]
>({
	keys(data) {
		return [
			"board-item",
			"collection",
			data,
		];
	},
	async queryFn(body) {
		return apiBoardItemCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
