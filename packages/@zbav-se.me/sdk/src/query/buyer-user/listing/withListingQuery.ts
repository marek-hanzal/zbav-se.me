import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiListingCollection,
	apiListingCount,
	apiListingFetch,
	type tListing,
	type tListingCountQuery,
	type tListingQuery,
} from "../../../api/buyer-user";

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
	async fetch(data) {
		return withApi(
			apiListingFetch({
				body: data,
			}),
		);
	},
	async collection(data) {
		return withApi(
			apiListingCollection({
				body: data,
			}),
		);
	},
	async count(data) {
		return withApi(
			apiListingCount({
				body: data,
			}),
		);
	},
	async create(_data) {
		throw new Error("Listing create is not supported by this query wrapper.");
	},
	async delete(_data) {
		throw new Error("Listing delete is not supported by this query wrapper.");
	},
	async patch(_data) {
		throw new Error("Listing patch is not supported by this query wrapper.");
	},
});
