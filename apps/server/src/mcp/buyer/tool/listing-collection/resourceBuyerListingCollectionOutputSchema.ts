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
		const outputSchema = McpSchema.withJsonSchema(toolListingCollection.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "buyer.listingCollection",
			title: toolListingCollection.title,
			description: toolListingCollection.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolListingCollection.guideResourceUris,
			profileResourceUris: toolListingCollection.profileResourceUris,
			entityResourceUris: toolListingCollection.entityResourceUris,
			fieldResourceUris: toolListingCollection.fieldResourceUris,
			responseInterpretationHints: [
				"Use collection output for browse and search flows, not for guaranteed exact entity lookup.",
				"distance is meaningful only for geo-aware queries that include meta.latLon.",
				"Actor-relative fields such as my, isFavourite, isIgnored, hasFlag, transactionId, and thumb depend on the authenticated buyer context.",
				"When both id fields and expanded objects are present, prefer the expanded objects for user-facing explanation.",
			],
			itemSchemaUri: resourceListingSchema.uri,
			relatedSchemas: [
				resourceListingSchema.uri,
			],
		});
	},
};
