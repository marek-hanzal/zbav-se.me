import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { draftCountFn } from "~/seller/draft/fn/draftCountFn";
import { draftCreateFn } from "~/seller/draft/fn/draftCreateFn";
import { draftDeleteFn } from "~/seller/draft/fn/draftDeleteFn";
import { draftFetchFn } from "~/seller/draft/fn/draftFetchFn";
import type { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { withListingValidationQuery } from "~/seller/listing/query/withListingValidationQuery";
import { withUserResourceLimitQuery } from "~/user/user-resource/query/withUserResourceLimitQuery";
import { draftPatchFn } from "../fn/draftPatchFn";
import type { DraftPatchSchema } from "../server/schema/DraftPatchSchema";

export const withDraftQuery = withEntityQuery({
	logger: getRootLogger([
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
	keys() {
		return [
			"seller",
			"draft",
		];
	},
	toIdKey(id): DraftQuerySchema.Type {
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
				async invalidate({ queryClient }) {
					await withListingValidationQuery.invalidate(queryClient);
				},
			},
			{
				async invalidate({ queryClient, variables }) {
					const draftId = variables.query.where?.id;

					if (!draftId) {
						return;
					}

					await withUserResourceLimitQuery.invalidator(
						queryClient,
						[
							"fetch",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "listing.gallery.count",
									reference: draftId,
								},
							},
						},
					);
				},
			},
		],
	},
});
