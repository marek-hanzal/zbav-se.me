import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Listing Behavior

TL;DR:
- Buyer listing output is a published listing enriched with buyer-specific signals.
- Fields like my, isFavourite, isIgnored, hasFlag, transactionId, thumb, distance, and restriction carry workflow meaning.
- MCP listing dates are ISO 8601 strings.

This guide explains listing semantics in the current buyer MCP surface.

Important fields:
- my: true when the listing belongs to the current authenticated user.
- isFavourite: true when the current user saved this listing to favourites.
- isIgnored: true when the current user chose not to see this listing again.
- hasFlag: true when the current user flagged this listing.
- transactionId: the current user's related transaction for this listing, or null when none exists.
- thumb: the current user's like/dislike signal for this listing, or null when none exists.
- distance: distance from the query location to the listing in kilometers; null when no geo distance applies.
- restriction: content restriction level for the listing.

Dates:
- createdAt, updatedAt, and expiresAt are returned as ISO 8601 strings in MCP output.

Agent hint:
- Treat buyer listing output as a shopping-oriented view of a published listing, not as the seller editing model.
`;

export const resourceGuideListingBehavior: McpResourceDefinition.Definition = {
	name: "mcp-guide-listing-behavior",
	uri: McpSchema.withGuideResourceUri("listing-behavior"),
	title: "Guide: Listing Behavior",
	description:
		"Agent-facing explanation of buyer listing semantics, including buyer-specific derived fields and listing date formatting.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "listing-behavior",
			title: "Guide: Listing Behavior",
			kind: "guide",
			text,
		});
	},
};
