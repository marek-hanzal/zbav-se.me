import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";

const text = `# Roles

TL;DR:
- Zbav-se.me has two explicit roles: buyer and seller.
- Each role has its own toolset and workflow.
- Pick the role first, then pick the tool.

Zbav-se.me is a smart marketplace for everyone, but it is not roleless.

Buyer role:
- Buyer tools are used for shopping, browsing, filtering, comparing, and inspecting published listings.
- Buyer outputs may include buyer-specific derived fields such as favourites, ignores, flags, distance, thumb state, or transaction hints.

Seller role:
- Seller tools are used for preparing drafts, managing galleries, publishing listings, and handling the selling workflow.
- Seller-facing entities can share names with buyer-facing entities, but the workflow meaning may differ.

What the agent should do:
- Identify the role before choosing a tool.
- Use the namespace and description as the first signal.
- Treat buyer and seller tools as different workflow surfaces even when they mention similar entities.

What the agent should not do:
- Do not mix buyer and seller assumptions.
- Do not assume a buyer listing view is the same as a seller listing view.
- Do not switch role context without a clear reason.
`;

export const resourceGuideRoles: McpResourceDefinition.Definition = {
	name: "mcp-guide-roles",
	uri: McpSchema.withGuideResourceUri("roles"),
	title: "Guide: Roles",
	description:
		"Agent-facing explanation of buyer and seller role separation, including how role context affects tool choice and entity meaning.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "roles",
			title: "Guide: Roles",
			kind: "guide",
			text,
		});
	},
};
