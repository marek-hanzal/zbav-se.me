import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiFeedCollection,
	apiFeedCount,
	apiFeedCreate,
	apiFeedDelete,
	apiFeedFetch,
	apiFeedPatch,
	type tFeed,
	type tFeedCountQuery,
	type tFeedCreate,
	type tFeedPatch,
	type tFeedQuery,
} from "../../../api/buyer";

export const withFeedQuery = withEntityQuery<
	tFeed,
	tFeedQuery,
	tFeedQuery,
	tFeedCountQuery,
	tFeedPatch,
	tFeedCreate,
	tFeedQuery
>({
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	createFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedCreate({
					body: request,
					headers,
				}),
			);
		},
	}),
	deleteFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedDelete({
					body: request,
					headers,
				}),
			);
		},
	}),
	patchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiFeedPatch({
					body: request,
					headers,
				}),
			);
		},
	}),
	async patchCollectionFn(_data) {
		throw new Error("Feed collection patch is not supported.");
	},
});
