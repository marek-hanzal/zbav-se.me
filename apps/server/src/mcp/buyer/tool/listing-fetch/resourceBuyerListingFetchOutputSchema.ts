import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import { resourceListingSchema } from "~/mcp/buyer/resource/resourceListingSchema";
import { toolListingFetch } from "~/mcp/buyer/tool/listing-fetch/toolListingFetch";

export const resourceBuyerListingFetchOutputSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-buyer-listing-fetch",
	uri: McpSchema.withSchemaResourceUri("buyer.listingFetch"),
	title: "buyer.listingFetch Output Schema",
	description: "Output schema resource for the buyer.listingFetch MCP tool.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(toolListingFetch.outputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			name: "buyer.listingFetch",
			title: toolListingFetch.title,
			description: toolListingFetch.description,
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			relatedSchemas: [
				resourceListingSchema.uri,
			],
		});
	},
};
