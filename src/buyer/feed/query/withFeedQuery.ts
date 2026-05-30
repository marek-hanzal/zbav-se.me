import { withEntityQuery } from "@/lib/client/query";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { feedCountFn } from "~/buyer/feed/fn/feedCountFn";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { feedDeleteFn } from "~/buyer/feed/fn/feedDeleteFn";
import { feedFetchFn } from "~/buyer/feed/fn/feedFetchFn";
import { feedPatchFn } from "~/buyer/feed/fn/feedPatchFn";
import type { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import type { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import type { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withUserResourceLimitQuery } from "~/user/user-resource/query/withUserResourceLimitQuery";

export const withFeedQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withFeedQuery",
	]),
	errors: {} as {
		fetch: feedFetchFn.Error;
		collection: feedCollectionFn.Error;
		count: feedCountFn.Error;
		patch: feedPatchFn.Error;
		create: feedCreateFn.Error;
		delete: feedDeleteFn.Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"feed",
		];
	},
	toIdKey(id): FeedQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: FeedQuerySchema.Type) {
		return feedFetchFn({
			data,
		});
	},
	async collectionFn(data: FeedQuerySchema.Type) {
		return feedCollectionFn({
			data,
		});
	},
	async countFn(data: FeedCountQuerySchema.Type) {
		return feedCountFn({
			data,
		});
	},
	async createFn(data: FeedCreateSchema.Type) {
		return feedCreateFn({
			data,
		});
	},
	async deleteFn(data: FeedQuerySchema.Type) {
		return feedDeleteFn({
			data,
		});
	},
	async patchFn(data: FeedPatchSchema.Type) {
		return feedPatchFn({
			data,
		});
	},
	async patchCollectionFn(_data: never): Promise<FeedSchema.Type[]> {
		throw new Error("Feed collection patch is not supported.");
	},
	invalidate: {
		create: [
			{
				async invalidate({ queryClient }) {
					await withUserResourceLimitQuery.invalidator(
						queryClient,
						[
							"fetch",
							"collection",
							"count",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "feed.count",
								},
							},
						},
					);
				},
			},
		],
		delete: [
			{
				async invalidate({ queryClient }) {
					await withUserResourceLimitQuery.invalidator(
						queryClient,
						[
							"fetch",
							"collection",
							"count",
						],
						{
							fetch: {
								where: {
									resourceDefinitionId: "feed.count",
								},
							},
						},
					);
				},
			},
		],
	},
});
