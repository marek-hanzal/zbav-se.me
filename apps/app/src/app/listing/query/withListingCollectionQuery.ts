import { withQuery } from "@use-pico/client";
import {
	apiListingCollection,
	type tListingCollection,
	type tListingQuery,
} from "@zbav-se.me/sdk";

export const withListingCollectionQuery = withQuery<
	tListingQuery,
	tListingCollection
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
