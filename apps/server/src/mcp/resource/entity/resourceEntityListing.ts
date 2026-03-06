import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Listing

TL;DR:
- Listing is the main published marketplace item.
- In the current MCP surface, buyer tools return published listing data.
- A listing comes from a draft and references gallery, category, and location.

What it is:
- A listing is the public, published form of an offer on the marketplace.

What it is used for:
- It is the main thing buyers browse, search, inspect, and compare.

Relationships:
- listing <- published from draft
- listing -> gallery
- listing -> category
- listing -> location

Role note:
- In buyer context, listing output can include buyer-specific derived fields such as favourite state, ignore state, thumb state, distance, and transaction hints.

Agent hint:
- Use listing as the core published entity. If the workflow is about preparation before publication, that is draft, not listing.
`;

export const resourceEntityListing: McpResourceDefinition.Definition = {
	name: "mcp-entity-listing",
	uri: McpSchema.withEntityResourceUri("listing"),
	title: "Entity: Listing",
	description:
		"Main published marketplace entity, including how listing relates to draft, gallery, category, and location.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing",
			title: "Entity: Listing",
			kind: "entity",
			text,
			relatedEntities: [
				McpSchema.withEntityResourceUri("draft"),
				McpSchema.withEntityResourceUri("gallery"),
				McpSchema.withEntityResourceUri("category"),
				McpSchema.withEntityResourceUri("location"),
			],
		});
	},
};
