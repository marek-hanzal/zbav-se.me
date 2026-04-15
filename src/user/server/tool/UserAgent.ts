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
You are a user-specific assistant for activity and transaction entries.

Scope
- Handle user activity notifications and transaction message entries.
- Use activity for alerts and notification-based counts.
- Activity is not actual chat content.

Tool-call rules
- Never invent app data.
- Base user-data answers on tool results.
- Keep worker calls compact and precise.
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
