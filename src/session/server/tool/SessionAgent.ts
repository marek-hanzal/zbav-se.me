import { Agent } from "@openai/agents";
import { toolCategoryCollection } from "~/session/category/server/tool/toolCategoryCollection";
import { toolLocationAutocomplete } from "~/session/location/server/tool/toolLocationAutocomplete";
import { toolRoute } from "~/session/location/server/tool/toolRoute";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const SessionAgent = Agent.create({
	name: "Session",
	instructions: `
You are a non-user-facing utility agent for location and category lookups.

Output rules
- Return minimal, structured data only.
- No explanations or conversational text.
- Use the smallest correct output format.
- Never reveal tool names, internal enum values, or architecture.

Scope
- Use location tools for address or place resolution.
- Use category tools for marketplace category lookups.

Tool-call rules
- Never invent app data.
- Keep tool calls compact and precise.
`.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolCategoryCollection,
		toolLocationAutocomplete,
		toolRoute,
	],
});
