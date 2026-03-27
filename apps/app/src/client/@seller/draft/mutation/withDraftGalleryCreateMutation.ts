import { withMutation } from "@use-pico/client/mutation";
import { draftGalleryCreateFn } from "~/client/@seller/draft-gallery/server/fn/draftGalleryCreateFn";
import type { DraftGalleryCreateSchema } from "~/client/@seller/draft-gallery/server/schema/DraftGalleryCreateSchema";
import type { GallerySchema } from "~/client/@user/gallery/server/schema/GallerySchema";
import { withDraftQuery } from "../query/withDraftQuery";

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
