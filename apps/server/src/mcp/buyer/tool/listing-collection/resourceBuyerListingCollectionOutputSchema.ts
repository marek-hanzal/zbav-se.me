import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { toolListingCollection } from "~/mcp/buyer/tool/listing-collection/toolListingCollection";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceBuyerListingCollectionOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-buyer-listing-collection",
	uri: McpSchema.withSchemaResourceUri("buyer.listingCollection"),
	title: "buyer.listingCollection Output Schema",
	description: "Output schema resource for the buyer.listingCollection MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = toolListingCollection.outputJsonSchema;

		return McpResourceDefinition.withContent(uri, {
			name: "buyer.listingCollection",
			title: toolListingCollection.title,
			description: toolListingCollection.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolListingCollection.guideResourceUris,
			entityResourceUris: toolListingCollection.entityResourceUris,
			itemSchemaUri: resourceListingSchema.uri,
			relatedSchemas: [
				resourceListingSchema.uri,
			],
		});
	},
};
