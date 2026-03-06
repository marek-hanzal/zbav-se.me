import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumListingWarranty: McpResourceDefinition.Definition = {
	name: "mcp-enum-listing-warranty",
	uri: McpSchema.withEnumResourceUri("listing-warranty"),
	title: "Enum: Listing Warranty",
	description: "Meaning of listing warranty values.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-warranty",
			title: "Enum: Listing Warranty",
			kind: "enum",
			purpose: "Warranty status attached to a listing.",
			values: {
				warranty: "The item has warranty coverage.",
				"no-warranty": "The item has no warranty coverage.",
				custom: "Warranty exists but must be interpreted from the listing details.",
			},
		});
	},
};
