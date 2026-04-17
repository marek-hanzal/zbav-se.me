import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { feedCountFn } from "~/buyer/feed/fn/feedCountFn";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { feedDeleteFn } from "~/buyer/feed/fn/feedDeleteFn";
import { feedFetchFn } from "~/buyer/feed/fn/feedFetchFn";
import { feedPatchFn } from "~/buyer/feed/fn/feedPatchFn";
import type { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import type { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";

const logger = getRootLogger([
	"query",
	"withFeedQuery",
]);

export const withFeedQuery = withEntityQuery<
	FeedSchema.Type,
	FeedQuerySchema.Type,
	FeedQuerySchema.Type,
	FeedCountQuerySchema.Type,
	FeedPatchSchema.Type,
	FeedCreateSchema.Type,
	FeedQuerySchema.Type,
	never
>({
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		logger.trace("fetchFn", data);

		return feedFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		logger.trace("collectionFn", data);

		return feedCollectionFn({
			data,
		});
	},
	async countFn(data) {
		logger.trace("countFn", data);

		return feedCountFn({
			data,
		});
	},
	async createFn(data) {
		logger.trace("createFn", data);

		return feedCreateFn({
			data,
		});
	},
	async deleteFn(data) {
		logger.trace("deleteFn", data);

		return feedDeleteFn({
			data,
		});
	},
	async patchFn(data) {
		logger.trace("patchFn", data);

		return feedPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data) {
		throw new Error("Feed collection patch is not supported.");
	},
});
