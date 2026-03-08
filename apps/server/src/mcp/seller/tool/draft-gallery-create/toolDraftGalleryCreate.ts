import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftGalleryCreateFx } from "~/@seller/draft-gallery/fx/draftGalleryCreateFx";
import { DraftGalleryCreateSchema } from "~/@seller/draft-gallery/schema/DraftGalleryCreateSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { DraftGalleryCreateMcpSchema } from "~/mcp/seller/schema/DraftGalleryCreateMcpSchema";
import { GalleryMcpOutputSchema } from "~/mcp/user/schema/GalleryMcpOutputSchema";

const examples: McpToolDefinition.Example<DraftGalleryCreateMcpSchema.Type>[] = [
	{
		title: "Replace draft gallery with ordered images",
		description:
			"Use this after user.uploadCreate returned upload ids and you want to set the final draft image order.",
		arguments: {
			draftId: "draft_123",
			uploadIds: [
				"upload_cover",
				"upload_side",
				"upload_detail",
			],
		},
	},
];

export const toolDraftGalleryCreate: McpToolDefinition.Definition<
	DraftGalleryCreateMcpSchema,
	GalleryMcpOutputSchema
> = {
	name: "draftGalleryCreate",
	namespace: "seller",
	title: "Seller Draft Gallery Create",
	description:
		"Seller-side write tool for replacing the ordered gallery of an existing draft with upload ids. Use this after the image upload chain is complete: user.s3PreSign -> external PUT -> user.uploadCreate. Existing draft gallery items are replaced. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, zbav://mcp/entity/draft, zbav://mcp/entity/gallery, and zbav://mcp/entity/upload.",
	role: "seller",
	workflowHint:
		"Use after upload ids are ready and you want the draft gallery order to match the final publish intent.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.image.prepareUpload"),
		McpSchema.withProfileResourceUri("seller.draft.galleryReplace"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
		McpSchema.withEntityResourceUri("gallery"),
		McpSchema.withEntityResourceUri("upload"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("draft.id"),
		McpSchema.withFieldResourceUri("draft.uploadIds"),
		McpSchema.withFieldResourceUri("draft.gallery"),
		McpSchema.withFieldResourceUri("upload.id"),
		McpSchema.withFieldResourceUri("upload.url"),
	],
	annotations: {
		title: "Seller Draft Gallery Create",
		readOnlyHint: false,
		destructiveHint: true,
		idempotentHint: false,
	},
	inputSchema: DraftGalleryCreateMcpSchema,
	outputSchema: GalleryMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = DraftGalleryCreateSchema.parse(args);

		return draftGalleryCreateFx({
			...input,
			userId: context.userId,
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: GallerySchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: GalleryMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
