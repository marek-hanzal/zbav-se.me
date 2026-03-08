import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceDraftSchema } from "~/mcp/seller/resource/resourceDraftSchema";
import { toolDraftPatch } from "~/mcp/seller/tool/draft-patch/toolDraftPatch";

export const resourceSellerDraftPatchOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-patch",
	uri: McpSchema.withSchemaResourceUri("seller.draftPatch"),
	title: "seller.draftPatch Output Schema",
	description: "Output schema resource for the seller.draftPatch MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolDraftPatch.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftPatch",
			title: toolDraftPatch.title,
			description: toolDraftPatch.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftPatch.guideResourceUris,
			profileResourceUris: toolDraftPatch.profileResourceUris,
			entityResourceUris: toolDraftPatch.entityResourceUris,
			fieldResourceUris: toolDraftPatch.fieldResourceUris,
			responseInterpretationHints: [
				"The returned draft is the fresh post-patch state and should replace stale in-memory draft data.",
				"Patch only sends changed fields; omitted fields are preserved server-side.",
			],
			relatedSchemas: [
				resourceDraftSchema.uri,
			],
		});
	},
};
