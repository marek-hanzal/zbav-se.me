import { withMutation } from "@use-pico/client/mutation";
import { withFeedQuery } from "~/client/@buyer/feed/query/withFeedQuery";
import { feedGalleryCreateFn } from "~/client/@buyer/feed-gallery/server/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/client/@buyer/feed-gallery/server/schema/FeedGalleryCreateSchema";
import type { GallerySchema } from "~/client/@user/gallery/server/schema/GallerySchema";

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
