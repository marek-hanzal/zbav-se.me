import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiFeedCollection,
	apiFeedFetch,
	apiFeedPatch,
	type tFeed,
	type tFeedPatch,
	type tFeedQuery,
} from "../../../api/buyer-user";

export const withFeedQuery = withEntityQuery<tFeed, tFeedQuery, tFeedQuery, tFeedPatch>({
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetch(data) {
		return apiFeedFetch({
			body: data,
			throwOnError: true,
		}).then((res) => res.data);
	},
	async collection(data) {
		return apiFeedCollection({
			body: data,
			throwOnError: true,
		}).then((res) => res.data);
	},
	async patch(data) {
		return withApi(
			apiFeedPatch({
				body: data,
			}),
		);
	},
});
