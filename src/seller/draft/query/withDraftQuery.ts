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
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return draftFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return draftCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return draftCountFn({
			data,
		});
	},
	async createFn(data, context) {
		logger.trace("createFn", {
			data,
			context,
		});

		return draftCreateFn({
			data,
		});
	},
	async deleteFn(data, context) {
		logger.trace("deleteFn", {
			data,
			context,
		});

		return draftDeleteFn({
			data,
		});
	},
	async patchFn(data, context) {
		logger.trace("patchFn", {
			data,
			context,
		});

		return draftPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data, _context) {
		throw new Error("Draft collection patch is not supported.");
	},
});
