import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { listingCollectionFn } from "~/public-listing/fn/listingCollectionFn";
import { listingCountFn } from "~/public-listing/fn/listingCountFn";
import { listingFetchFn } from "~/public-listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/public-listing/schema/ListingCountQuerySchema";
import type { ListingQuerySchema } from "~/public-listing/schema/ListingQuerySchema";
import type { ListingSchema } from "~/public-listing/schema/ListingSchema";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";

export const withListingQuery = withEntityQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withListingQuery",
	]),
	errors: {} as {
		fetch: listingFetchFn.Error;
		collection: listingCollectionFn.Error;
		count: listingCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keysFn() {
		return [
			"public",
			"listing",
		];
	},
	toIdKeyFn(id): ListingQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: ListingQuerySchema.Type) {
		return listingFetchFn({
			data,
		});
	},
	async collectionFn(data: ListingQuerySchema.Type) {
		return listingCollectionFn({
			data,
		});
	},
	async countFn(data: ListingCountQuerySchema.Type) {
		return listingCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<ListingSchema.Type> {
		throw new Error("Listing create is not supported.");
	},
	async deleteFn(_data: never): Promise<ListingSchema.Type> {
		throw new Error("Listing delete is not supported.");
	},
	async patchFn(_data: never): Promise<ListingSchema.Type> {
		throw new Error("Listing patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<ListingSchema.Type[]> {
		throw new Error("Listing collection patch is not supported.");
	},
});
