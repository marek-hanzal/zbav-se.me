import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Category

TL;DR:
- Category is the organizational context for listings.
- Listings reference category directly.
- Category influences language, filter expectations, and workflow interpretation.

What it is:
- A category is the market organization layer that gives a listing context.

What it is used for:
- It helps structure the marketplace and shapes what filters and vocabulary make sense.

Relationships:
- category <- referenced by listing
- category <- referenced by draft

Agent hint:
- Category is not just decoration. It is part of the listing context and often matters for filtering and interpretation.
`;

export const resourceEntityCategory: McpResourceDefinition.Definition = {
	name: "mcp-entity-category",
	uri: McpSchema.withEntityResourceUri("category"),
	title: "Entity: Category",
	description:
		"Organizational marketplace entity that gives listings and drafts context for language and filtering.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "category",
			title: "Entity: Category",
			kind: "entity",
			text,
			relatedEntities: [
				McpSchema.withEntityResourceUri("listing"),
				McpSchema.withEntityResourceUri("draft"),
			],
		});
	},
};
