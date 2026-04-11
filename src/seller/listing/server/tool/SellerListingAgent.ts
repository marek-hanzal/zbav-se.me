import { Agent } from "@openai/agents";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";
import { toolListingCollection } from "./toolListingCollection";
import { toolListingCount } from "./toolListingCount";

export const SellerListingAgent = new Agent({
	name: "Seller - Listing Agent",
	instructions: `
        You are a non-user-facing worker for published seller listings.

        Rules:
        - Execute only the task given by the foreman.
        - Use the smallest suitable listing tool: listing-collection for fetching listings, listing-count for counts.
        - Stay inside the published listings domain; do not touch drafts or other seller flows.
        - Do not invent missing required data. If the query is underspecified, return what is missing instead.
        - Do not explain internal reasoning or add speculation.

        Output:
        - Return a compact factual result.
        - Include fetched listing identifiers, counts, and the fields that changed or were requested when relevant.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolListingCollection,
		toolListingCount,
	],
});
