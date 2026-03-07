import { toolSellerListingCount } from "~/mcp/seller/tool/listing-count/toolSellerListingCount";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceSellerListingCountOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-seller-listing-count",
	uri: McpSchema.withSchemaResourceUri("seller.listingCount"),
	title: "seller.listingCount Output Schema",
	description: "Output schema resource for the seller.listingCount MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(
			toolSellerListingCount.outputSchema,
			"output",
		);

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "seller.listingCount",
			title: toolSellerListingCount.title,
			description: toolSellerListingCount.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			guideResourceUris: toolSellerListingCount.guideResourceUris,
			profileResourceUris: toolSellerListingCount.profileResourceUris,
			entityResourceUris: toolSellerListingCount.entityResourceUris,
			fieldResourceUris: toolSellerListingCount.fieldResourceUris,
			responseInterpretationHints: [
				"Use this to learn whether published listings exist before loading full listing collections.",
				"An empty filter query returns the seller-owned total count as both total and filter in the fast path.",
			],
		});
	},
};
