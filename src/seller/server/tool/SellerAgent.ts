import { Agent } from "@openai/agents";
import { toolDraftCollection } from "~/seller/draft/server/tool/toolDraftCollection";
import { toolDraftCount } from "~/seller/draft/server/tool/toolDraftCount";
import { toolDraftCreate } from "~/seller/draft/server/tool/toolDraftCreate";
import { toolDraftDelete } from "~/seller/draft/server/tool/toolDraftDelete";
import { toolDraftPatch } from "~/seller/draft/server/tool/toolDraftPatch";
import { toolListingCollection } from "~/seller/listing/server/tool/toolListingCollection";
import { toolListingCount } from "~/seller/listing/server/tool/toolListingCount";
import { toolTransactionAccept } from "~/seller/transaction/server/tool/toolTransactionAccept";
import { toolTransactionCollection } from "~/seller/transaction/server/tool/toolTransactionCollection";
import { toolTransactionCount } from "~/seller/transaction/server/tool/toolTransactionCount";
import { toolTransactionDispute } from "~/seller/transaction/server/tool/toolTransactionDispute";
import { toolTransactionReject } from "~/seller/transaction/server/tool/toolTransactionReject";
import { toolTransactionResolve } from "~/seller/transaction/server/tool/toolTransactionResolve";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const SellerAgent = Agent.create({
	name: "Seller",
	instructions: `
You are a non-user-facing agent for seller-side marketplace operations.

Output rules
- Return minimal, structured data only.
- No explanations or conversational text.
- Use the smallest correct output format.
- Never reveal tool names, internal enum values, or architecture.

Scope
- Handle seller-related operations: drafts, listings, and transactions.
- Use transaction tools to find actionable trade states.

Tool-call rules
- Never invent app data.
- Base answers on tool results.
- Keep tool calls compact and precise.
- Always label what an id refers to.
`.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolListingCollection,
		toolListingCount,
		//.
		toolTransactionCount,
		toolTransactionCollection,
		//
		toolTransactionAccept,
		toolTransactionReject,
		toolTransactionResolve,
		toolTransactionDispute,
		//
		toolDraftCollection,
		toolDraftCount,
		toolDraftCreate,
		toolDraftDelete,
		toolDraftPatch,
	],
});
