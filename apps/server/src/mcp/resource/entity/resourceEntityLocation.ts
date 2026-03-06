import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Location

TL;DR:
- Location is a first-class part of marketplace data.
- Listings reference location directly.
- Distance and geo behavior depend on listing location and query meta.

What it is:
- A location is the normalized place information used by listings and marketplace search.

What it is used for:
- It provides the address and geographic context for a listing.
- It enables geo-aware filtering, sorting, and distance calculation.

Relationships:
- location <- referenced by listing
- location <- referenced by draft

Agent hint:
- If a buyer query uses geo behavior, location and query meta.latLon are the important pieces.
`;

export const resourceEntityLocation: McpResourceDefinition.Definition = {
	name: "mcp-entity-location",
	uri: McpSchema.withEntityResourceUri("location"),
	title: "Entity: Location",
	description:
		"First-class marketplace location entity used by listings, drafts, geo filtering, and distance behavior.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "location",
			title: "Entity: Location",
			kind: "entity",
			text,
			relatedEntities: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("draft"),
			],
		});
	},
};
