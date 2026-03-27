import { withMutation } from "@use-pico/client/mutation";
import { draftGalleryCreateFn } from "~/server/@seller/draft-gallery/fn/draftGalleryCreateFn";
import type { DraftGalleryCreateSchema } from "~/server/@seller/draft-gallery/schema/DraftGalleryCreateSchema";
import type { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { withDraftQuery } from "./withDraftQuery";

export const withDraftGalleryCreateMutation = withMutation<
	DraftGalleryCreateSchema.Type,
	GallerySchema.Type,
	Error
>({
	keys() {
		return [
			"seller",
			"draft",
			"gallery",
		];
	},
	async mutationFn(variables) {
		return draftGalleryCreateFn({
			data: variables,
		});
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withDraftQuery.invalidator(queryClient, [
					"fetch",
					"collection",
					"count",
				]);
			},
		},
	],
});
