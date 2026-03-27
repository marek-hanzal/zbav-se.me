import { withEntityQuery } from "@use-pico/client/query";
import { draftCollectionFn } from "~/server/@seller/draft/fn/draftCollectionFn";
import { draftCountFn } from "~/server/@seller/draft/fn/draftCountFn";
import { draftCreateFn } from "~/server/@seller/draft/fn/draftCreateFn";
import { draftDeleteFn } from "~/server/@seller/draft/fn/draftDeleteFn";
import { draftFetchFn } from "~/server/@seller/draft/fn/draftFetchFn";
import { draftPatchFn } from "~/server/@seller/draft/fn/draftPatchFn";
import type { DraftCountQuerySchema } from "~/server/@seller/draft/schema/DraftCountQuerySchema";
import type { DraftCreateSchema } from "~/server/@seller/draft/schema/DraftCreateSchema";
import type { DraftPatchSchema } from "~/server/@seller/draft/schema/DraftPatchSchema";
import type { DraftQuerySchema } from "~/server/@seller/draft/schema/DraftQuerySchema";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";

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
