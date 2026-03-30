import { withEntityQuery } from "@/lib/client/query";
import { draftCollectionFn } from "~/seller/draft/server/fn/draftCollectionFn";
import { draftCountFn } from "~/seller/draft/server/fn/draftCountFn";
import { draftCreateFn } from "~/seller/draft/server/fn/draftCreateFn";
import { draftDeleteFn } from "~/seller/draft/server/fn/draftDeleteFn";
import { draftFetchFn } from "~/seller/draft/server/fn/draftFetchFn";
import { draftPatchFn } from "~/seller/draft/server/fn/draftPatchFn";
import type { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import type { DraftPatchSchema } from "~/seller/draft/server/schema/DraftPatchSchema";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const withDraftQuery = withEntityQuery<
	DraftSchema.Type,
	DraftQuerySchema.Type,
	DraftQuerySchema.Type,
	DraftCountQuerySchema.Type,
	DraftPatchSchema.Type,
	DraftCreateSchema.Type,
	DraftQuerySchema.Type,
	never
>({
	keys: () => [
		"draft",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return draftFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return draftCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return draftCountFn({
			data,
		});
	},
	async createFn(data) {
		return draftCreateFn({
			data,
		});
	},
	async deleteFn(data) {
		return draftDeleteFn({
			data,
		});
	},
	async patchFn(data) {
		return draftPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data) {
		throw new Error("Draft collection patch is not supported.");
	},
});
