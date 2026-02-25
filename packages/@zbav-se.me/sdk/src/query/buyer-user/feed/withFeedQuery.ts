import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiFeedCollection,
	apiFeedCount,
	apiFeedFetch,
	apiFeedPatch,
	type tFeed,
	type tFeedCountQuery,
	type tFeedPatch,
	type tFeedQuery,
} from "../../../api/buyer-user";

export const withFeedQuery = withEntityQuery<
	tFeed,
	tFeedQuery,
	tFeedQuery,
	tFeedCountQuery,
	tFeedPatch
>({
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetch(data) {
		return withApi(
			apiFeedFetch({
				body: data,
			}),
		);
	},
	async collection(data) {
		return withApi(
			apiFeedCollection({
				body: data,
			}),
		);
	},
	async count(data) {
		return withApi(
			apiFeedCount({
				body: data,
			}),
		);
	},
	async patch(data) {
		return withApi(
			apiFeedPatch({
				body: data,
			}),
		);
	},
});
