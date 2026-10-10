import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";
import { draftCollectionFn } from "~/seller-draft/fn/draftCollectionFn";
import { draftCountFn } from "~/seller-draft/fn/draftCountFn";
import { draftCreateFn } from "~/seller-draft/fn/draftCreateFn";
import { draftDeleteFn } from "~/seller-draft/fn/draftDeleteFn";
import { draftFetchFn } from "~/seller-draft/fn/draftFetchFn";
import { draftPatchFn } from "~/seller-draft/fn/draftPatchFn";
import type { DraftCountQuerySchema } from "~/seller-draft/schema/DraftCountQuerySchema";
import type { DraftCreateSchema } from "~/seller-draft/schema/DraftCreateSchema";
import type { DraftPatchSchema } from "~/seller-draft/schema/DraftPatchSchema";
import type { DraftQuerySchema } from "~/seller-draft/schema/DraftQuerySchema";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { withListingValidationQuery } from "~/seller-listing/query/withListingValidationQuery";
import { withResourceLimitQuery } from "~/user-resource-limit/query/withResourceLimitQuery";

export const withDraftQuery = withEntityQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withDraftQuery",
	]),
	errors: {} as {
		fetch: draftFetchFn.Error;
		collection: draftCollectionFn.Error;
		count: draftCountFn.Error;
		patch: draftPatchFn.Error;
		create: draftCreateFn.Error;
		delete: draftDeleteFn.Error;
		patchCollection: Error;
	},
	keysFn() {
		return [
			"seller",
			"draft",
		];
	},
	toIdKeyFn(id): DraftQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: DraftQuerySchema.Type) {
		return draftFetchFn({
			data,
		});
	},
	async collectionFn(data: DraftQuerySchema.Type) {
		return draftCollectionFn({
			data,
		});
	},
	async countFn(data: DraftCountQuerySchema.Type) {
		return draftCountFn({
			data,
		});
	},
	async createFn(data: DraftCreateSchema.Type) {
		return draftCreateFn({
			data,
		});
	},
	async deleteFn(data: DraftQuerySchema.Type): Promise<DraftSchema.Type> {
		return draftDeleteFn({
			data,
		});
	},
	async patchFn(data: DraftPatchSchema.Type): Promise<DraftSchema.Type> {
		return draftPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data: never): Promise<DraftSchema.Type[]> {
		throw new Error("Draft collection patch is not supported.");
	},
	invalidate: {
		patch: [
			{
				async invalidateFn({ queryClient }) {
					await withListingValidationQuery.invalidateFn(queryClient);
				},
			},
			{
				async invalidateFn({ queryClient }) {
					await withResourceLimitQuery.invalidatorFn(
						queryClient,
						[
							"fetch",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "seller:limit:listing.gallery.count",
								},
							},
						},
					);
				},
			},
		],
	},
});
