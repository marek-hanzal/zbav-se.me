import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { listingCreateFn } from "~/seller/listing/fn/listingCreateFn";
import { listingFetchFn } from "~/seller/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";

const logger = getRootLogger([
	"query",
	"withListingQuery",
]);

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
		logger.trace("fetchFn", {
			data,
		});

		return listingFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		logger.trace("collectionFn", {
			data,
		});

		return listingCollectionFn({
			data,
		});
	},
	async countFn(data) {
		logger.trace("countFn", {
			data,
		});

		return listingCountFn({
			data,
		});
	},
	async createFn(data) {
		logger.trace("createFn", {
			data,
		});

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
