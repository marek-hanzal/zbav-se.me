import { withMutation } from "@/lib/client/mutation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { feedGalleryCreateFn } from "~/buyer/feed-gallery/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/buyer/feed-gallery/server/schema/FeedGalleryCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

export const withFeedGalleryCreateMutation = withMutation<
	FeedGalleryCreateSchema.Type,
	GallerySchema.Type,
	Error
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
