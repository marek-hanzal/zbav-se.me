import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { toolDraftCount } from "~/mcp/seller/tool/draft-count/toolDraftCount";

export const resourceSellerDraftCountOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-count",
	uri: McpSchema.withSchemaResourceUri("seller.draftCount"),
	title: "seller.draftCount Output Schema",
	description: "Output schema resource for the seller.draftCount MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolDraftCount.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftCount",
			title: toolDraftCount.title,
			description: toolDraftCount.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftCount.guideResourceUris,
			profileResourceUris: toolDraftCount.profileResourceUris,
			entityResourceUris: toolDraftCount.entityResourceUris,
			fieldResourceUris: toolDraftCount.fieldResourceUris,
			responseInterpretationHints: [
				"filter is the MCP-facing count for public filter semantics.",
				"isFilterEmpty=true means the seller has drafts overall, but none match the provided filter.",
			],
		});
	},
};
