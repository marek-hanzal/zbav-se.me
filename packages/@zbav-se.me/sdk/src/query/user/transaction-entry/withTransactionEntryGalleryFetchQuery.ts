import { withQuery } from "@use-pico/client/query";
import { apiTransactionEntryGalleryFetch } from "../../../api/user/sdk.gen";
import type {
	tApiTransactionEntryGalleryFetchResponse,
	tTransactionEntryGalleryQuery,
} from "../../../api/user/types.gen";

export const withTransactionEntryGalleryFetchQuery = withQuery<
	tTransactionEntryGalleryQuery,
	tApiTransactionEntryGalleryFetchResponse[200]
>({
	keys(data) {
		return [
			"transaction-entry",
			"gallery",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiTransactionEntryGalleryFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
