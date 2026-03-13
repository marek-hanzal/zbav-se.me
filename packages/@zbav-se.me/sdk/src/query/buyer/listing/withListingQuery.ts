import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiListingCollection,
	apiListingCount,
	apiListingFetch,
	type tListing,
	type tListingCountQuery,
	type tListingQuery,
} from "../../../api/buyer";

export const withListingQuery = withEntityQuery<
	tListing,
	tListingQuery,
	tListingQuery,
	tListingCountQuery,
	never,
	never,
	never
>({
	keys: () => [
		"listing",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return withApi(
			apiListingFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiListingCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiListingCount({
				body: data,
			}),
		);
	},
	async createFn(_data) {
		throw new Error("Listing create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Listing delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Listing patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Listing collection patch is not supported.");
	},
});
