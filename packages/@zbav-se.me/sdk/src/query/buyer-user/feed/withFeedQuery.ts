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
	async create(data) {
		return withApi(
			apiFeedCreate({
				body: data,
			}),
		);
	},
	async delete(data) {
		return withApi(
			apiFeedDelete({
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
