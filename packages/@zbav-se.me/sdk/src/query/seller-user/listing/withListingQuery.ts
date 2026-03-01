import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiListingCollection,
	apiListingCount,
	apiListingCreate,
	apiListingFetch,
	type tListing,
	type tListingCountQuery,
	type tListingCreate,
	type tListingQuery,
} from "../../../api/seller-user";

export const withListingQuery = withEntityQuery<
	tListing,
	tListingQuery,
	tListingQuery,
	tListingCountQuery,
	never,
	tListingCreate,
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
	async create(data) {
		return withApi(
			apiListingCreate({
				body: data,
			}),
		);
	},
	async delete(_data) {
		throw new Error("Listing delete is not supported by this query wrapper.");
	},
	async patch(_data) {
		throw new Error("Listing patch is not supported by this query wrapper.");
	},
});
