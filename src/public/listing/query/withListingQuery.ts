import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { listingCollectionFn } from "~/public/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/public/listing/fn/listingCountFn";
import { listingFetchFn } from "~/public/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";
import type { ListingSchema } from "~/public/listing/server/schema/ListingSchema";

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
	async createFn(_data, _context) {
		throw new Error("Listing create is not supported.");
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
