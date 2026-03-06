import { ListingMcpOutputSchema } from "~/mcp/buyer/schema/ListingMcpOutputSchema";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceListingSchema: McpResourceDefinition.Definition = {
	name: "mcp-schema-listing",
	uri: McpSchema.withSchemaResourceUri("listing"),
	title: "Listing Output Schema",
	description:
		"Shared buyer listing output schema with field descriptions for model consumption.",
	mimeType: "application/json",
	read(uri) {
		const outputSchema = McpSchema.withJsonSchema(ListingMcpOutputSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			canonicalUri: uri.toString(),
			name: "listing",
			title: "Listing Output Schema",
			description:
				"Shared schema for a single buyer-visible listing returned by MCP listing tools. Date fields are ISO 8601 strings.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
			entityResourceUris: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("gallery"),
				McpSchema.withEntityResourceUri("category"),
				McpSchema.withEntityResourceUri("location"),
			],
			enumResourceUris: [
				McpSchema.withEnumResourceUri("listing-restriction"),
				McpSchema.withEnumResourceUri("listing-price"),
				McpSchema.withEnumResourceUri("currency"),
				McpSchema.withEnumResourceUri("listing-warranty"),
				McpSchema.withEnumResourceUri("listing-delivery"),
				McpSchema.withEnumResourceUri("thumb"),
			],
			fieldResourceUris: [
				McpSchema.withFieldResourceUri("listing.my"),
				McpSchema.withFieldResourceUri("listing.condition"),
				McpSchema.withFieldResourceUri("listing.age"),
				McpSchema.withFieldResourceUri("listing.priceType"),
				McpSchema.withFieldResourceUri("listing.warranty"),
				McpSchema.withFieldResourceUri("listing.restriction"),
				McpSchema.withFieldResourceUri("listing.transactionId"),
				McpSchema.withFieldResourceUri("listing.thumb"),
				McpSchema.withFieldResourceUri("listing.draftId"),
			],
		});
	},
};
