import { withQuery } from "@use-pico/client/query";
import { apiMessageThreadMessageCollection } from "../../../api/user/sdk.gen";
import type {
	tApiMessageThreadMessageCollectionRequest,
	tApiMessageThreadMessageCollectionResponse,
} from "../../../api/user/types.gen";

export const withMessageThreadMessageCollectionQuery = withQuery<
	Omit<tApiMessageThreadMessageCollectionRequest, "url">,
	tApiMessageThreadMessageCollectionResponse[200]
>({
	keys(data) {
		return [
			"message-thread",
			"message",
			"list",
			data,
		];
	},
	async queryFn(data) {
		return apiMessageThreadMessageCollection({
			...data,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
