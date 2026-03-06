import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";

const text = `# Overview

TL;DR:
- This is a smart marketplace for everyone, with explicit buyer and seller roles.
- Use tools for actions, schema resources for data shape, and guides for behavior.
- Do not assume hidden shortcuts or soft rules; backend rules are hard.

Zbav-se.me is a smart marketplace for everyone, with a clear role split between buyers and sellers.

What the agent should assume:
- MCP tools operate over the same real business logic as the REST API.
- Buyer and seller are explicit product roles with distinct toolsets and workflow intent.
- Buyer tools are for shopping and browsing in the authenticated buyer context.
- The system prefers structured, minimal, factual interaction over noisy free-form negotiation.
- Tools describe what can be done. Guide resources explain how the market behaves.

What the agent should do:
- Use tool descriptions first to choose the right action.
- Use schema resources when data shape or field meaning matters.
- Prefer explicit filters, sorting, and concrete queries over vague exploration.
- If uncertain, inspect a guide or schema resource before making assumptions.

What the agent should not assume:
- There are no hidden shortcuts, magic overrides, or soft exceptions.
- Missing data is not automatically an error; the system may intentionally hide or exclude things.
- The marketplace is not designed for manipulative growth tricks or spammy interaction.

What the system enforces anyway:
- Business logic, visibility gates, lifecycle rules, and validation are enforced by backend logic even if the agent ignores this guide.
`;

export const resourceGuideOverview: McpResourceDefinition.Definition = {
	name: "mcp-guide-overview",
	uri: "zbav://mcp/guide/overview",
	title: "Guide: Overview",
	description:
		"Agent-facing overview of Zbav-se.me, explaining what kind of marketplace this is and how MCP tools should be used.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "overview",
			title: "Guide: Overview",
			kind: "guide",
			text,
		});
	},
};
