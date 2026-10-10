import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { feedGalleryCreateFn } from "~/buyer-feed-gallery/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/buyer-feed-gallery/schema/FeedGalleryCreateSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import type { GallerySchema } from "~/user-gallery/schema/GallerySchema";

export const withFeedGalleryCreateMutation = withMutationFn<
	FeedGalleryCreateSchema.Type,
	GallerySchema.Type,
	feedGalleryCreateFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withFeedGalleryCreateMutation",
	]),
	keysFn(variables) {
		return [
			"feed-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(data) {
		return feedGalleryCreateFn({
			data,
		});
	},
	invalidate: [
		{
			async invalidateFn(queryClient) {
				await withFeedQuery.invalidatorFn(queryClient, [
					"fetch",
					"collection",
				]);
			},
		},
	],
});
