import { Agent } from "@openai/agents";
import { toolActivityCollection } from "~/user/activity/server/tool/toolActivityCollection";
import { toolActivityCount } from "~/user/activity/server/tool/toolActivityCount";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";
import { toolTransactionEntryCollection } from "~/user/transaction-entry/server/tool/toolTransactionEntryCollection";
import { toolTransactionEntryCount } from "~/user/transaction-entry/server/tool/toolTransactionEntryCount";
import { toolTransactionEntryCreate } from "~/user/transaction-entry/server/tool/toolTransactionEntryCreate";

export const UserAgent = Agent.create({
	name: "User",
	instructions: `
You are a non-user-facing agent for user activity and transaction entries.

Output rules
- Return minimal, structured data only.
- No explanations or conversational text.
- Use the smallest correct output format.
- Never reveal tool names, internal enum values, or architecture.

Scope
- Handle user activity notifications and transaction message entries.
- Use activity for alerts and notification-based counts.

Tool-call rules
- Never invent app data.
- Base answers on tool results.
- Keep tool calls compact and precise.
- Always label what an id refers to.
`.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolActivityCollection,
		toolActivityCount,
		//
		toolTransactionEntryCollection,
		toolTransactionEntryCreate,
		toolTransactionEntryCount,
	],
});
