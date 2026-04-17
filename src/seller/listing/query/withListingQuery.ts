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
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return listingFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return listingCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return listingCountFn({
			data,
		});
	},
	async createFn(data, context) {
		logger.trace("createFn", {
			data,
			context,
		});

		return listingCreateFn({
			data,
		});
	},
	async deleteFn(_data, _context) {
		throw new Error("Listing delete is not supported.");
	},
	async patchFn(_data, _context) {
		throw new Error("Listing patch is not supported.");
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Listing collection patch is not supported.");
	},
});
