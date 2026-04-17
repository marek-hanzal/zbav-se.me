import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftGalleryCreateFn } from "~/seller/draft-gallery/fn/draftGalleryCreateFn";
import type { DraftGalleryCreateSchema } from "~/seller/draft-gallery/server/schema/DraftGalleryCreateSchema";
import type { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { withDraftQuery } from "../query/withDraftQuery";

export const withDraftGalleryCreateMutation = withMutation<
	DraftGalleryCreateSchema.Type,
	GallerySchema.Type,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withDraftGalleryCreateMutation",
	]),
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
