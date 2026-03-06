import { resourceDraftSchema } from "~/mcp/seller/resource/resourceDraftSchema";
import { toolDraftCreate } from "~/mcp/seller/tool/draft-create/toolDraftCreate";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceSellerDraftCreateOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-create",
	uri: McpSchema.withSchemaResourceUri("seller.draftCreate"),
	title: "seller.draftCreate Output Schema",
	description: "Output schema resource for the seller.draftCreate MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolDraftCreate.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftCreate",
			title: toolDraftCreate.title,
			description: toolDraftCreate.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftCreate.guideResourceUris,
			profileResourceUris: toolDraftCreate.profileResourceUris,
			entityResourceUris: toolDraftCreate.entityResourceUris,
			fieldResourceUris: toolDraftCreate.fieldResourceUris,
			responseInterpretationHints: [
				"Preserve draft.id immediately; it is the handle for later patch, gallery, and publish steps.",
				"A newly created draft already owns a gallery, even when uploadIds were omitted.",
			],
			relatedSchemas: [
				resourceDraftSchema.uri,
			],
		});
	},
};
