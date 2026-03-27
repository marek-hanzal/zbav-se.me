import { withEntityQuery } from "@use-pico/client/query";
import { listingCollectionFn } from "~/client/@seller/listing/server/fn/listingCollectionFn";
import { listingCountFn } from "~/client/@seller/listing/server/fn/listingCountFn";
import { listingCreateFn } from "~/client/@seller/listing/server/fn/listingCreateFn";
import { listingFetchFn } from "~/client/@seller/listing/server/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/client/@seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingCreateSchema } from "~/client/@seller/listing/server/schema/ListingCreateSchema";
import type { ListingQuerySchema } from "~/client/@seller/listing/server/schema/ListingQuerySchema";
import type { ListingSchema } from "~/client/@seller/listing/server/schema/ListingSchema";

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
