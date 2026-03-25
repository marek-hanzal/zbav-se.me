import { withEntityQuery } from "@use-pico/client/query";
import { feedCollectionFn } from "~/server/@buyer/feed/fn/feedCollectionFn";
import { feedCountFn } from "~/server/@buyer/feed/fn/feedCountFn";
import { feedCreateFn } from "~/server/@buyer/feed/fn/feedCreateFn";
import { feedDeleteFn } from "~/server/@buyer/feed/fn/feedDeleteFn";
import { feedFetchFn } from "~/server/@buyer/feed/fn/feedFetchFn";
import { feedPatchFn } from "~/server/@buyer/feed/fn/feedPatchFn";
import type { FeedCountQuerySchema } from "~/server/@buyer/feed/schema/FeedCountQuerySchema";
import type { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";
import type { FeedPatchSchema } from "~/server/@buyer/feed/schema/FeedPatchSchema";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import type { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

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
