import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceDraftSchema } from "~/mcp/seller/resource/resourceDraftSchema";
import { toolDraftCollection } from "~/mcp/seller/tool/draft-collection/toolDraftCollection";

export const resourceSellerDraftCollectionOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-draft-collection",
	uri: McpSchema.withSchemaResourceUri("seller.draftCollection"),
	title: "seller.draftCollection Output Schema",
	description: "Output schema resource for the seller.draftCollection MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolDraftCollection.outputSchema, "output");
		const itemFieldResourceUris = toolDraftCollection.fieldResourceUris.filter((fieldUri) =>
			fieldUri.startsWith(McpSchema.withFieldResourceUri("draft.")),
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.draftCollection",
			title: toolDraftCollection.title,
			description: toolDraftCollection.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolDraftCollection.guideResourceUris,
			profileResourceUris: toolDraftCollection.profileResourceUris,
			entityResourceUris: toolDraftCollection.entityResourceUris,
			fieldResourceUris: toolDraftCollection.fieldResourceUris,
			itemFieldResourceUris,
			itemOutputSchema:
				outputSchema.type === "array" &&
				outputSchema.items &&
				typeof outputSchema.items === "object" &&
				!Array.isArray(outputSchema.items)
					? outputSchema.items
					: undefined,
			itemOutputSummary:
				outputSchema.type === "array" &&
				outputSchema.items &&
				typeof outputSchema.items === "object" &&
				!Array.isArray(outputSchema.items)
					? McpSchema.withSummary(outputSchema.items)
					: undefined,
			itemSchemaUri: resourceDraftSchema.uri,
			relatedSchemas: [
				resourceDraftSchema.uri,
			],
			responseInterpretationHints: [
				"Each array item is one seller-owned draft with its expanded gallery, category, and location context.",
				"usedAt=null usually means the draft is still available for later patch or publish.",
			],
		});
	},
};
