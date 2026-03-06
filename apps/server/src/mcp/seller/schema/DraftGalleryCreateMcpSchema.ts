import { z } from "@hono/zod-openapi";

export const DraftGalleryCreateMcpSchema = z
	.object({
		draftId: z
			.string()
			.describe(
				"Target draft id whose gallery should be replaced with the provided upload ids.",
			),
		uploadIds: z
			.array(z.string())
			.min(1)
			.describe(
				"Ordered upload ids to attach to the draft gallery. Existing draft gallery items are replaced.",
			),
	})
	.describe("Replace a draft gallery with a new ordered list of upload ids.");

export type DraftGalleryCreateMcpSchema = typeof DraftGalleryCreateMcpSchema;

export namespace DraftGalleryCreateMcpSchema {
	export type Type = z.infer<DraftGalleryCreateMcpSchema>;
}
