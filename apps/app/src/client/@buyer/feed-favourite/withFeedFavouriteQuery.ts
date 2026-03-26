import { withEntityQuery } from "@use-pico/client/query";

export const withFeedFavouriteQuery = withEntityQuery<
	tFeedFavourite,
	tFeedQuery,
	tFeedQuery,
	tFeedFavouriteCountQuery,
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
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedFavouriteFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedFavouriteCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedFavouriteCount({
					body: request,
					headers,
				}),
			);
		},
	}),
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
