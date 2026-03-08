import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceDraftSchema } from "~/mcp/seller/resource/resourceDraftSchema";
import { toolDraftFetch } from "~/mcp/seller/tool/draft-fetch/toolDraftFetch";

export const resourceSellerDraftFetchOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-fetch",
	uri: McpSchema.withSchemaResourceUri("seller.draftFetch"),
	title: "seller.draftFetch Output Schema",
	description: "Output schema resource for the seller.draftFetch MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolDraftFetch.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftFetch",
			title: toolDraftFetch.title,
			description: toolDraftFetch.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftFetch.guideResourceUris,
			profileResourceUris: toolDraftFetch.profileResourceUris,
			entityResourceUris: toolDraftFetch.entityResourceUris,
			fieldResourceUris: toolDraftFetch.fieldResourceUris,
			relatedSchemas: [
				resourceDraftSchema.uri,
			],
			responseInterpretationHints: [
				"Use the returned draft as the canonical current draft state before patch, gallery replace, or publish.",
				"Preserve draft.id from this output; it is the stable handle for later write steps.",
			],
		});
	},
};
