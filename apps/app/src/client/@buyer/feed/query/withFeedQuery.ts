import { withEntityQuery } from "@use-pico/client/query";
import { feedCollectionFn } from "~/client/@buyer/feed/server/fn/feedCollectionFn";
import { feedCountFn } from "~/client/@buyer/feed/server/fn/feedCountFn";
import { feedCreateFn } from "~/client/@buyer/feed/server/fn/feedCreateFn";
import { feedDeleteFn } from "~/client/@buyer/feed/server/fn/feedDeleteFn";
import { feedFetchFn } from "~/client/@buyer/feed/server/fn/feedFetchFn";
import { feedPatchFn } from "~/client/@buyer/feed/server/fn/feedPatchFn";
import type { FeedCountQuerySchema } from "~/client/@buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedCreateSchema } from "~/client/@buyer/feed/server/schema/FeedCreateSchema";
import type { FeedPatchSchema } from "~/client/@buyer/feed/server/schema/FeedPatchSchema";
import type { FeedQuerySchema } from "~/client/@buyer/feed/server/schema/FeedQuerySchema";
import type { FeedSchema } from "~/client/@buyer/feed/server/schema/FeedSchema";

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
