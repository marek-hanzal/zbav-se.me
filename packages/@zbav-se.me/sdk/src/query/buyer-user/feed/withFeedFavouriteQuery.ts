import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiFeedFavouriteCollection,
	apiFeedFavouriteCount,
	apiFeedFavouriteFetch,
	type tFeedFavourite,
	type tFeedFavouriteCountQuery,
	type tFeedQuery,
} from "../../../api/buyer-user";

export const withFeedFavouriteQuery = withEntityQuery<
	tFeedFavourite,
	tFeedQuery,
	tFeedQuery,
	tFeedFavouriteCountQuery,
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
		return withApi(
			apiFeedFavouriteFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiFeedFavouriteCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiFeedFavouriteCount({
				body: data,
			}),
		);
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
});
