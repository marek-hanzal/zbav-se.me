import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
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
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionEntryGalleryFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
