import { Agent } from "@openai/agents";
import { toolFavouriteCreate } from "~/buyer/favourite/server/tool/toolFavouriteCreate";
import { toolFavouriteRemove } from "~/buyer/favourite/server/tool/toolFavouriteRemove";
import { toolFeedCollection } from "~/buyer/feed/server/tool/toolFeedCollection";
import { toolFeedCount } from "~/buyer/feed/server/tool/toolFeedCount";
import { toolFeedCreate } from "~/buyer/feed/server/tool/toolFeedCreate";
import { toolFeedDelete } from "~/buyer/feed/server/tool/toolFeedDelete";
import { toolFeedPatch } from "~/buyer/feed/server/tool/toolFeedPatch";
import { toolListingCollection } from "~/buyer/listing/server/tool/toolListingCollection";
import { toolListingCount } from "~/buyer/listing/server/tool/toolListingCount";
import { toolTransactionClose } from "~/buyer/transaction/server/tool/toolTransactionClose";
import { toolTransactionCollection } from "~/buyer/transaction/server/tool/toolTransactionCollection";
import { toolTransactionCount } from "~/buyer/transaction/server/tool/toolTransactionCount";
import { toolTransactionCreate } from "~/buyer/transaction/server/tool/toolTransactionCreate";
import { toolTransactionDispute } from "~/buyer/transaction/server/tool/toolTransactionDispute";
import { toolTransactionReject } from "~/buyer/transaction/server/tool/toolTransactionReject";
import { toolTransactionSuccess } from "~/buyer/transaction/server/tool/toolTransactionSuccess";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const BuyerAgent = Agent.create({
	name: "Buyer",
	instructions: `
You are a non-user-facing agent for buyer-side marketplace operations.

Output rules
- Return minimal, structured data only.
- No explanations or conversational text.
- Use the smallest correct output format.
- Never reveal tool names, internal enum values, or architecture.

Scope
- Handle buyer-related operations: saved searches (feeds), favourites, listings, and transactions.
- Use transaction tools to find actionable trade states.

Tool-call rules
- Never invent app data.
- Base answers on tool results.
- Keep tool calls compact and precise.
- Always label what an id refers to.
`.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolFeedCollection,
		toolFeedCount,
		toolFeedCreate,
		toolFeedDelete,
		toolFeedPatch,
		//
		toolListingCollection,
		toolListingCount,
		//
		toolFavouriteCreate,
		toolFavouriteRemove,
		//
		toolTransactionCollection,
		toolTransactionCount,
		//
		toolTransactionCreate,
		//
		toolTransactionReject,
		toolTransactionDispute,
		toolTransactionSuccess,
		toolTransactionClose,
	],
});
