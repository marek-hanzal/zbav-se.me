import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";

const text = `# Rules

TL;DR:
- Treat all gates and lifecycle rules as hard.
- Never assume trust or reputation can be bought or bypassed.
- If something is blocked, missing, closed, or hidden, respect that state.

This guide describes hard operating constraints for agents.

What the agent should assume:
- No pay-to-win for trust or reputation.
- Visibility gates, sensitivity, bans, limits, and lifecycle states are real hard constraints.
- Terminal states are final. Closed is closed.
- A missing listing or result may be intentional, not a backend failure.
- Buyer and seller roles are distinct; similarly named data can have different workflow meaning by role.

What the agent should do:
- Respect closed, banned, expired, hidden, ignored, and otherwise unavailable states.
- Prefer conservative interpretation when data is incomplete or ambiguous.
- Inspect guides or schemas instead of inventing explanations.
- Treat user-specific listing fields as real product signals, not noise.

What the agent must not do:
- Do not invent hidden penalties, manual overrides, or admin bypasses.
- Do not imply trust, score, or reputation can be purchased.
- Do not encourage manipulative, policy-evasive, or gate-bypassing behavior.
- Do not interpret absence as proof that data does not exist globally.

What the system enforces anyway:
- Visibility, validation, bans, and terminal-state rules are enforced by backend logic.
- If a result is blocked or unavailable, the agent cannot bypass that with MCP.
`;

export const resourceGuideRules: McpResourceDefinition.Definition = {
	name: "mcp-guide-rules",
	uri: "zbav://mcp/guide/rules",
	title: "Guide: Rules",
	description:
		"Agent-facing hard rules for Zbav-se.me, including market constraints, lifecycle boundaries, and forbidden assumptions.",
	mimeType: "application/json",
	read(uri) {
		return McpResourceDefinition.withContent(uri, {
			name: "rules",
			title: "Guide: Rules",
			kind: "guide",
			text,
		});
	},
};
