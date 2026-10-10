import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import { listingCollectionFn } from "~/seller-listing/fn/listingCollectionFn";
import { listingCountFn } from "~/seller-listing/fn/listingCountFn";
import { listingCreateFn } from "~/seller-listing/fn/listingCreateFn";
import { listingDeleteFn } from "~/seller-listing/fn/listingDeleteFn";
import { listingFetchFn } from "~/seller-listing/fn/listingFetchFn";
import type { ListingCountQuerySchema } from "~/seller-listing/schema/ListingCountQuerySchema";
import type { ListingCreateSchema } from "~/seller-listing/schema/ListingCreateSchema";
import type { ListingQuerySchema } from "~/seller-listing/schema/ListingQuerySchema";
import type { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import { withResourceLimitQuery } from "~/user-resource-limit/query/withResourceLimitQuery";

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
		create: listingCreateFn.Error;
		delete: listingDeleteFn.Error;
		patchCollection: Error;
	},
	keysFn() {
		return [
			"seller",
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
				async invalidateFn({ queryClient }) {
					await withDraftQuery.invalidatorFn(queryClient, [
						"fetch",
						"count",
						"collection",
					]);
				},
			},
			{
				async invalidateFn({ queryClient }) {
					await withResourceLimitQuery.invalidatorFn(
						queryClient,
						[
							"fetch",
							"collection",
							"count",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "seller:limit:listing.count",
								},
							},
						},
					);
				},
			},
		],
		delete: [
			{
				async invalidateFn({ queryClient }) {
					await withResourceLimitQuery.invalidatorFn(
						queryClient,
						[
							"fetch",
							"collection",
							"count",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "seller:limit:listing.count",
								},
							},
						},
					);
				},
			},
		],
	},
});
