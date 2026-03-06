import { z } from "@hono/zod-openapi";
import { UploadMcpOutputSchema } from "~/mcp/user/schema/UploadMcpOutputSchema";

const GalleryItemMcpOutputSchema = z.object({
	id: z.string().describe("Stable gallery item id."),
	galleryId: z.string().describe("Parent gallery id."),
	uploadId: z.string().describe("Referenced upload id for this gallery image."),
	sort: z.number().describe("Zero-based order of the image inside the gallery."),
	upload: UploadMcpOutputSchema.describe("Expanded upload metadata for this gallery item."),
});

export const GalleryMcpOutputSchema = z
	.object({
		id: z.string().describe("Stable gallery id shared by a draft or listing."),
		items: z
			.array(GalleryItemMcpOutputSchema)
			.describe("Ordered gallery items with expanded upload metadata."),
	})
	.describe("Gallery output used by draft and listing write flows.");

export type GalleryMcpOutputSchema = typeof GalleryMcpOutputSchema;

export namespace GalleryMcpOutputSchema {
	export type Type = z.infer<GalleryMcpOutputSchema>;
}
