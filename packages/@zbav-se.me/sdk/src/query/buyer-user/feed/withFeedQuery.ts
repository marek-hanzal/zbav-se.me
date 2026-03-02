import { withEntityQuery } from "@use-pico/client/query";
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
} from "../../../api/buyer-user";

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
	async fetchFn(data) {
		return withApi(
			apiFeedFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiFeedCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiFeedCount({
				body: data,
			}),
		);
	},
	async createFn(data) {
		return withApi(
			apiFeedCreate({
				body: data,
			}),
		);
	},
	async deleteFn(data) {
		return withApi(
			apiFeedDelete({
				body: data,
			}),
		);
	},
	async patchFn(data) {
		return withApi(
			apiFeedPatch({
				body: data,
			}),
		);
	},
});
