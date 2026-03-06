import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumListingRestriction: McpResourceDefinition.Definition = {
	name: "mcp-enum-listing-restriction",
	uri: McpSchema.withEnumResourceUri("listing-restriction"),
	title: "Enum: Listing Restriction",
	description: "Meaning of listing restriction levels exposed by listing resources and tools.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-restriction",
			title: "Enum: Listing Restriction",
			kind: "enum",
			purpose: "Content restriction level of a listing.",
			values: {
				none: "Normal listing content with no special restriction.",
				"adult-relaxed":
					"Adult-adjacent content with lighter restrictions than fully adult content.",
				adult: "Adult content level that requires stricter handling.",
				sensitive: "Sensitive content that may require special visibility treatment.",
				restricted: "Strongly restricted content level with the strictest handling.",
			},
		});
	},
};
