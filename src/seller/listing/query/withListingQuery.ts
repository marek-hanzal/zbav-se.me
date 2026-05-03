import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { listingCreateFn } from "~/seller/listing/fn/listingCreateFn";
import { listingDeleteFn } from "~/seller/listing/fn/listingDeleteFn";
import { listingFetchFn } from "~/seller/listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";

export const withListingQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withListingQuery",
	]),
	errors: {} as {
		fetch: listingFetchFn.Error;
		collection: listingCollectionFn.Error;
		count: listingCountFn.Error;
		patch: Error;
		create: listingCreateFn.Error;
		delete: listingDeleteFn.Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"seller",
			"listing",
		];
	},
	toIdKey(id): ListingQuerySchema.Type {
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
	async createFn(data: ListingCreateSchema.Type) {
		return listingCreateFn({
			data,
		});
	},
	async deleteFn(data: ListingQuerySchema.Type): Promise<ListingSchema.Type> {
		return listingDeleteFn({
			data,
		});
	},
	async patchFn(_data: never): Promise<ListingSchema.Type> {
		throw new Error("Listing patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<ListingSchema.Type[]> {
		throw new Error("Listing collection patch is not supported.");
	},
	invalidate: {
		create: [
			{
				async invalidate({ queryClient }) {
					await withDraftQuery.invalidator(queryClient, [
						"collection",
						"count",
					]);
				},
			},
		],
	},
});
