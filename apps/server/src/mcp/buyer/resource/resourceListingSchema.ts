import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";
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
		const outputSchema = McpSchema.withJsonSchema(ListingSchema, "output");

		return McpResourceDefinition.withContent(uri, {
			name: "listing",
			title: "Listing Output Schema",
			description:
				"Shared schema for a single buyer-visible listing returned by MCP listing tools.",
			outputSchema,
			outputSummary: McpSchema.withSummary(outputSchema),
		});
	},
};
