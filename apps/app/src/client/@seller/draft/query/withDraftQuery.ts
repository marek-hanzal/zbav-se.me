import { withEntityQuery } from "@use-pico/client/query";
import { draftCollectionFn } from "~/client/@seller/draft/server/fn/draftCollectionFn";
import { draftCountFn } from "~/client/@seller/draft/server/fn/draftCountFn";
import { draftCreateFn } from "~/client/@seller/draft/server/fn/draftCreateFn";
import { draftDeleteFn } from "~/client/@seller/draft/server/fn/draftDeleteFn";
import { draftFetchFn } from "~/client/@seller/draft/server/fn/draftFetchFn";
import { draftPatchFn } from "~/client/@seller/draft/server/fn/draftPatchFn";
import type { DraftCountQuerySchema } from "~/client/@seller/draft/server/schema/DraftCountQuerySchema";
import type { DraftCreateSchema } from "~/client/@seller/draft/server/schema/DraftCreateSchema";
import type { DraftPatchSchema } from "~/client/@seller/draft/server/schema/DraftPatchSchema";
import type { DraftQuerySchema } from "~/client/@seller/draft/server/schema/DraftQuerySchema";
import type { DraftSchema } from "~/client/@seller/draft/server/schema/DraftSchema";

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
