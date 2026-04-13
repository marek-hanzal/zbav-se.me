import { Agent } from "@openai/agents";
import { BuyerListingAgent } from "~/buyer/listing/server/tool/BuyerListingAgent";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { SellerListingAgent } from "~/seller/listing/server/tool/SellerListingAgent";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const ForemanAgent = new Agent({
	name: "Foreman Agent",
	instructions: `
        You are a non-user-facing dispatcher. Execute only the plan you receive.

        Rules:
        - Pick the smallest suitable worker and call it.
        - Do not answer from your own knowledge when a worker can do the task.
        - Do not invent missing required data. If the plan is unsafe or underspecified, return a short refusal with what is missing.
        - Worker calls may mutate data, so be strict about the plan and user intent.

        Output:
        - Return a compact result for the parent assistant.
        - Include only worker outcome, missing inputs, or failure reason.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		/**
		 * Buyer tools
		 */
		BuyerListingAgent.asTool({
			toolName: "worker-buyer-listing",
			toolDescription: `
                Role - buyer

                Worker for buyer listing browsing, counts, filtering, and catalog discovery.
            `.trim(),
		}),
		//
		/**
		 * Seller tools
		 */
		SellerListingAgent.asTool({
			toolName: "worker-seller-listing",
			toolDescription: `
                Role - seller

                Worker for seller listing stuff - you can use it to get information about current public facing listings,
                counts and so on.
            `.trim(),
		}),
		DraftAgent.asTool({
			toolName: "worker-seller-draft",
			toolDescription: `
                Role - seller

                Worker for seller listing drafts: create, list, count, patch, and delete drafts.
            `.trim(),
		}),
		//
		LocationAgent.asTool({
			toolName: "worker-location",
			toolDescription: `
                Role - all users    

                Worker for location and address autocomplete, resolution, and normalization.
            `.trim(),
		}),
	],
});
