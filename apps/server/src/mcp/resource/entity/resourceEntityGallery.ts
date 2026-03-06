import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Gallery

TL;DR:
- Gallery is the standard container for listing images.
- It is the canonical place to find photos for listings and drafts.
- Gallery contains ordered gallery items with uploads.

What it is:
- A gallery is the image collection attached to a listing or draft.

What it is used for:
- It groups photos in a stable place instead of spreading image semantics across the listing itself.

Relationships:
- gallery <- referenced by listing
- gallery <- referenced by draft
- gallery -> upload items

Agent hint:
- When you need photos, gallery is the standard place to read them from.
`;

export const resourceEntityGallery: McpResourceDefinition.Definition = {
	name: "mcp-entity-gallery",
	uri: McpSchema.withEntityResourceUri("gallery"),
	title: "Entity: Gallery",
	description:
		"Standard photo container entity for listings and drafts, including its relation to uploads.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "gallery",
			title: "Entity: Gallery",
			kind: "entity",
			text,
			relatedEntities: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("draft"),
			],
		});
	},
};
