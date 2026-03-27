import { withEntityQuery } from "@use-pico/client/query";
import type { FeedQuerySchema } from "~/@buyer/feed/server/schema/FeedQuerySchema";
import { feedFavouriteCollectionFn } from "~/@buyer/feed-favourite/server/fn/feedFavouriteCollectionFn";
import { feedFavouriteCountFn } from "~/@buyer/feed-favourite/server/fn/feedFavouriteCountFn";
import { feedFavouriteFetchFn } from "~/@buyer/feed-favourite/server/fn/feedFavouriteFetchFn";
import type { FeedFavouriteCountQuerySchema } from "~/@buyer/feed-favourite/server/schema/FeedFavouriteCountQuerySchema";
import type { FeedFavouriteSchema } from "~/@buyer/feed-favourite/server/schema/FeedFavouriteSchema";

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
