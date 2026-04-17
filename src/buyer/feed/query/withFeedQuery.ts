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
import { getRootLogger } from "~/common/log/getRootLogger";

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
	logger: getRootLogger([
		"query",
		"withFeedQuery",
	]),
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return feedFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return feedCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return feedCountFn({
			data,
		});
	},
	async createFn(data) {
		return feedCreateFn({
			data,
		});
	},
	async deleteFn(data) {
		return feedDeleteFn({
			data,
		});
	},
	async patchFn(data) {
		return feedPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data) {
		throw new Error("Feed collection patch is not supported.");
	},
});
