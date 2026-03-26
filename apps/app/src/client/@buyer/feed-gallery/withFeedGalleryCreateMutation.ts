import { withMutation } from "@use-pico/client/mutation";
import { feedGalleryCreateFn } from "~/server/@buyer/feed-gallery/fn/feedGalleryCreateFn";
import type { FeedGalleryCreateSchema } from "~/server/@buyer/feed-gallery/schema/FeedGalleryCreateSchema";
import type { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";

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
	invalidate: [],
});
