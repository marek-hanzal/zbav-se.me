import { withMutation } from "@use-pico/client/mutation";
import { withFeedQuery } from "~/@buyer/feed/query/withFeedQuery";
import { feedGalleryCreateFn } from "~/@buyer/feed-gallery/server/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/@buyer/feed-gallery/server/schema/FeedGalleryCreateSchema";
import type { GallerySchema } from "~/@user/gallery/server/schema/GallerySchema";

export const withFeedGalleryCreateMutation = withMutation<
	FeedGalleryCreateSchema.Type,
	GallerySchema.Type,
	Error
>({
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
