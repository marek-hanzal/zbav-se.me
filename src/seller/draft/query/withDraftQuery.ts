import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
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

const logger = getRootLogger([
	"query",
	"withDraftQuery",
]);

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
		logger.trace("fetchFn", data);

		return draftFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		logger.trace("collectionFn", data);

		return draftCollectionFn({
			data,
		});
	},
	async countFn(data) {
		logger.trace("countFn", data);

		return draftCountFn({
			data,
		});
	},
	async createFn(data) {
		logger.trace("createFn", data);

		return draftCreateFn({
			data,
		});
	},
	async deleteFn(data) {
		logger.trace("deleteFn", data);

		return draftDeleteFn({
			data,
		});
	},
	async patchFn(data) {
		logger.trace("patchFn", data);

		return draftPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data) {
		throw new Error("Draft collection patch is not supported.");
	},
});
