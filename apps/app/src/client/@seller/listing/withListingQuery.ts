import { withEntityQuery } from "@use-pico/client/query";
import { listingCollectionFn } from "~/server/@seller/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/server/@seller/listing/fn/listingCountFn";
import { listingCreateFn } from "~/server/@seller/listing/fn/listingCreateFn";
import { listingFetchFn } from "~/server/@seller/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/server/@seller/listing/schema/ListingCountQuerySchema";
import type { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";
import type { ListingQuerySchema } from "~/server/@seller/listing/schema/ListingQuerySchema";
import type { ListingSchema } from "~/server/@seller/listing/schema/ListingSchema";

export const withListingQuery = withEntityQuery<
	ListingSchema.Type,
	ListingQuerySchema.Type,
	ListingQuerySchema.Type,
	ListingCountQuerySchema.Type,
	never,
	ListingCreateSchema.Type,
	never,
	never
>({
	keys: () => [
		"seller",
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
	async createFn(data) {
		return listingCreateFn({
			data,
		});
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
