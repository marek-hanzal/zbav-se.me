import { withQuery } from "@use-pico/client/query";
import { apiListingCollection } from "../../../api/seller-user/sdk.gen";
import type {
	tApiListingCollectionResponse,
	tListingQuery,
} from "../../../api/seller-user/types.gen";

export const withListingCollectionQuery = withQuery<
	tListingQuery,
	tApiListingCollectionResponse[200]
>({
	keys(data) {
		return [
			"listing",
			"list",
			data,
		];
	},
	async queryFn(body) {
		return apiListingCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
