import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumListingPrice: McpResourceDefinition.Definition = {
	name: "mcp-enum-listing-price",
	uri: McpSchema.withEnumResourceUri("listing-price"),
	title: "Enum: Listing Price Type",
	description: "Meaning of listing price type values.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-price",
			title: "Enum: Listing Price Type",
			kind: "enum",
			purpose: "How the listing price should be interpreted.",
			values: {
				closed: "The listing uses a concrete fixed price.",
				open: "The listing price is open-ended or negotiable rather than fully fixed.",
			},
		});
	},
};
