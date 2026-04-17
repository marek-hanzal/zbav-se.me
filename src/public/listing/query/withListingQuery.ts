import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingCollectionFn } from "~/public/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/public/listing/fn/listingCountFn";
import { listingFetchFn } from "~/public/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";
import type { ListingSchema } from "~/public/listing/server/schema/ListingSchema";

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
	logger: getRootLogger([
		"query",
		"withListingQuery",
	]),
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
