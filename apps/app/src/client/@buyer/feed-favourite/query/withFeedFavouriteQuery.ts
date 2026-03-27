import { withEntityQuery } from "@use-pico/client/query";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import { feedFavouriteCollectionFn } from "~/server/@buyer/feed-favourite/fn/feedFavouriteCollectionFn";
import { feedFavouriteCountFn } from "~/server/@buyer/feed-favourite/fn/feedFavouriteCountFn";
import { feedFavouriteFetchFn } from "~/server/@buyer/feed-favourite/fn/feedFavouriteFetchFn";
import type { FeedFavouriteCountQuerySchema } from "~/server/@buyer/feed-favourite/schema/FeedFavouriteCountQuerySchema";
import type { FeedFavouriteSchema } from "~/server/@buyer/feed-favourite/schema/FeedFavouriteSchema";

export const withFeedFavouriteQuery = withEntityQuery<
	FeedFavouriteSchema.Type,
	FeedQuerySchema.Type,
	FeedQuerySchema.Type,
	FeedFavouriteCountQuerySchema.Type,
	never,
	never,
	never,
	never
>({
	keys: () => [
		"feed-favourite",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return feedFavouriteFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return feedFavouriteCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return feedFavouriteCountFn({
			data,
		});
	},
	async createFn(_data) {
		throw new Error("Feed favourite create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Feed favourite delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Feed favourite patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Feed favourite collection patch is not supported.");
	},
});
