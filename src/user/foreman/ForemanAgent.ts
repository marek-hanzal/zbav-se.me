import { Agent } from "@openai/agents";
import { FeedAgent } from "~/buyer/feed/server/tool/FeedAgent";
import { FavouriteAgent } from "~/buyer/feed-favourite/server/tool/FavouriteAgent";
import { BuyerListingAgent } from "~/buyer/listing/server/tool/BuyerListingAgent";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { SellerListingAgent } from "~/seller/listing/server/tool/SellerListingAgent";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const ForemanAgent = new Agent({
	name: "Foreman Agent",
	instructions: `
        You are a non-user-facing dispatcher. Execute only the compact English brief you receive.

        Rules:
        - Pick the smallest suitable worker and call it.
        - Do not answer from your own knowledge when a worker can do the task.
        - Do not invent missing required data. If the plan is unsafe or underspecified, return a short refusal with what is missing.
        - Worker calls may mutate data, so be strict about the plan and user intent.
        - User/session scope is already bound by the app; never ask workers for userId/accountId/sessionId and never pass one.
        - For collection tasks, request count or cursor { page: 0, size: 8 } unless the brief explicitly asks for more.
        - Never request more than 16 items from a worker in one call.
        - Use English for every worker call.

        Output:
        - Return compact English for the parent assistant.
        - Format: OK/MISSING/FAIL: one sentence; ids/counts/changed fields only.
        - Do not include reasoning, user-facing tone, or full datasets.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		/**
		 * Buyer tools
		 */
		BuyerListingAgent.asTool({
			toolName: "worker-buyer-listing",
			toolDescription:
				"Buyer catalog search/count. Use small cursors and requested fields only.",
		}),
		FeedAgent.asTool({
			toolName: "worker-buyer-feed",
			toolDescription: "Buyer saved-search feeds: list/count/create. Compact inputs only.",
		}),
		FavouriteAgent.asTool({
			toolName: "worker-buyer-favourite",
			toolDescription: "Buyer favourite feeds: fetch/list/count. Compact inputs only.",
		}),
		//
		/**
		 * Seller tools
		 */
		SellerListingAgent.asTool({
			toolName: "worker-seller-listing",
			toolDescription: "Seller published listings: list/count/status. No drafts.",
		}),
		DraftAgent.asTool({
			toolName: "worker-seller-draft",
			toolDescription:
				"Seller drafts: create/list/count/patch/delete. Confirm destructive intent upstream.",
		}),
		//
		LocationAgent.asTool({
			toolName: "worker-location",
			toolDescription:
				"Location/address autocomplete and normalization. Return best compact candidates.",
		}),
	],
});
