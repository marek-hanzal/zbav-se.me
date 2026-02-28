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
	tFeedPatch,
	never,
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
	async create(_data) {
		throw new Error("Feed create is not supported by this query wrapper.");
	},
	async delete(_data) {
		throw new Error("Feed delete is not supported by this query wrapper.");
	},
	async patch(data) {
		return withApi(
			apiFeedPatch({
				body: data,
			}),
		);
	},
});
