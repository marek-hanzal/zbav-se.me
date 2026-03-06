import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Draft

TL;DR:
- Draft is the prepared listing before publication.
- Draft mirrors much of listing data, but it is not the published marketplace item.
- Listing is published from draft; listing does not originate outside draft flow.

What it is:
- A draft is the seller-side preparation model for a future listing.

What it is used for:
- Drafts are used to prepare, update, validate, and complete listing data before publication.

Relationships:
- draft -> published as listing
- draft -> gallery
- draft -> category
- draft -> location

Rule:
- Publication happens from draft. A published listing does not appear from an ad hoc creation path outside draft flow.

Agent hint:
- If the workflow is about preparing or editing an unpublished offer, think in terms of draft, not listing.
`;

export const resourceEntityDraft: McpResourceDefinition.Definition = {
	name: "mcp-entity-draft",
	uri: McpSchema.withEntityResourceUri("draft"),
	title: "Entity: Draft",
	description: "Prepared pre-publication marketplace entity used to create published listings.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "draft",
			title: "Entity: Draft",
			kind: "entity",
			text,
			relatedEntities: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("gallery"),
				McpSchema.withEntityResourceUri("category"),
				McpSchema.withEntityResourceUri("location"),
			],
		});
	},
};
