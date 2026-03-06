import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

export const resourceEnumListingSort: McpResourceDefinition.Definition = {
	name: "mcp-enum-listing-sort",
	uri: McpSchema.withEnumResourceUri("listing-sort"),
	title: "Enum: Listing Sort",
	description: "Meaning of listing sort field and sort order values.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-sort",
			title: "Enum: Listing Sort",
			kind: "enum",
			purpose: "Sorting controls available for listing collection queries.",
			fields: {
				price: "Sort by listing price.",
				condition: "Sort by listing condition score.",
				age: "Sort by item age score.",
				createdAt: "Sort by listing creation timestamp.",
				updatedAt: "Sort by listing last update timestamp.",
				expiresAt: "Sort by listing expiration timestamp.",
				geo: "Sort by geographic distance or geo proximity.",
			},
			order: {
				asc: "Ascending order.",
				desc: "Descending order.",
			},
		});
	},
};
