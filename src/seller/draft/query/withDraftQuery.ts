import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { draftCountFn } from "~/seller/draft/fn/draftCountFn";
import { draftCreateFn } from "~/seller/draft/fn/draftCreateFn";
import { draftDeleteFn } from "~/seller/draft/fn/draftDeleteFn";
import { draftFetchFn } from "~/seller/draft/fn/draftFetchFn";
import { draftPatchFn } from "~/seller/draft/fn/draftPatchFn";
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
	logger: getRootLogger([
		"query",
		"withDraftQuery",
	]),
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
