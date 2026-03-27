import { withEntityQuery } from "@use-pico/client/query";
import { listingCollectionFn } from "~/server/@public/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/server/@public/listing/fn/listingCountFn";
import { listingFetchFn } from "~/server/@public/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/server/@public/listing/schema/ListingCountQuerySchema";
import type { ListingQuerySchema } from "~/server/@public/listing/schema/ListingQuerySchema";
import type { ListingSchema } from "~/server/@public/listing/schema/ListingSchema";

export const withListingQuery = withEntityQuery<
	ListingSchema.Type,
	ListingQuerySchema.Type,
	ListingQuerySchema.Type,
	ListingCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"public",
		"listing",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return listingFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return listingCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return listingCountFn({
			data,
		});
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
