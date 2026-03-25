import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import type { FeedCountQuerySchema } from "~/server/@buyer/feed/schema/FeedCountQuerySchema";
import type { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";
import type { FeedPatchSchema } from "~/server/@buyer/feed/schema/FeedPatchSchema";
import type { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";
import type { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

export const withFeedQuery = withEntityQuery<
	FeedSchema.Type,
	FeedQuerySchema.Type,
	FeedQuerySchema.Type,
	FeedCountQuerySchema.Type,
	FeedPatchSchema.Type,
	FeedCreateSchema.Type,
	FeedQuerySchema.Type,
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
