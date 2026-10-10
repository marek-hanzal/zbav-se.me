import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { feedGalleryCreateFn } from "~/buyer-feed-gallery/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/buyer-feed-gallery/schema/FeedGalleryCreateSchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import type { GallerySchema } from "~/user-gallery/schema/GallerySchema";

export const withFeedGalleryCreateMutation = withMutation<
	FeedGalleryCreateSchema.Type,
	GallerySchema.Type,
	feedGalleryCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withFeedGalleryCreateMutation",
	]),
	keys(variables) {
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
			async invalidate(queryClient) {
				await withFeedQuery.invalidator(queryClient, [
					"fetch",
					"collection",
				]);
			},
		},
	],
});
