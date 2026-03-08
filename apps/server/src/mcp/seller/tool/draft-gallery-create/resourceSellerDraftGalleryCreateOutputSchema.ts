import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { toolDraftGalleryCreate } from "~/mcp/seller/tool/draft-gallery-create/toolDraftGalleryCreate";
import { resourceGallerySchema } from "~/mcp/user/resource/resourceGallerySchema";

export const resourceSellerDraftGalleryCreateOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-gallery-create",
	uri: McpSchema.withSchemaResourceUri("seller.draftGalleryCreate"),
	title: "seller.draftGalleryCreate Output Schema",
	description: "Output schema resource for the seller.draftGalleryCreate MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(
			toolDraftGalleryCreate.outputSchema,
			"output",
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftGalleryCreate",
			title: toolDraftGalleryCreate.title,
			description: toolDraftGalleryCreate.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftGalleryCreate.guideResourceUris,
			profileResourceUris: toolDraftGalleryCreate.profileResourceUris,
			entityResourceUris: toolDraftGalleryCreate.entityResourceUris,
			fieldResourceUris: toolDraftGalleryCreate.fieldResourceUris,
			responseInterpretationHints: [
				"The returned gallery replaces the previous draft gallery order and contents.",
				"Gallery items reference upload ids that must already exist in application metadata.",
			],
			relatedSchemas: [
				resourceGallerySchema.uri,
			],
			itemSchemaUri: resourceGallerySchema.uri,
		});
	},
};
