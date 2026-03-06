import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { toolListingFetch } from "~/mcp/buyer/tool/listing-fetch/toolListingFetch";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceBuyerListingFetchOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-buyer-listing-fetch",
	uri: McpSchema.withSchemaResourceUri("buyer.listingFetch"),
	title: "buyer.listingFetch Output Schema",
	description: "Output schema resource for the buyer.listingFetch MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolListingFetch.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "buyer.listingFetch",
			title: toolListingFetch.title,
			description: toolListingFetch.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolListingFetch.guideResourceUris,
			profileResourceUris: toolListingFetch.profileResourceUris,
			entityResourceUris: toolListingFetch.entityResourceUris,
			fieldResourceUris: toolListingFetch.fieldResourceUris,
			responseInterpretationHints: [
				"Use the expanded location, category, and gallery objects when explaining a concrete listing.",
				"Actor-relative fields such as my, isFavourite, isIgnored, hasFlag, transactionId, and thumb depend on the authenticated buyer context.",
				"distance is only meaningful when the fetch query included geo context through meta.latLon.",
			],
			relatedSchemas: [
				resourceListingSchema.uri,
			],
		});
	},
};
