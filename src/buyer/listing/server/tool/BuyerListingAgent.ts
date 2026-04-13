import { Agent } from "@openai/agents";
import { toolCategoryCollection } from "~/session/category/server/tool/toolCategoryCollection";
import { toolLocationAutocomplete } from "~/session/location/server/tool/toolLocationAutocomplete";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";
import { toolListingCollection } from "./toolListingCollection";
import { toolListingCount } from "./toolListingCount";

export const BuyerListingAgent = new Agent({
	name: "Buyer - Listing Agent",
	instructions: `
        You are a non-user-facing worker for buyer listing discovery.

        Rules:
        - Execute only the task given by the foreman.
        - Use the smallest suitable listing tool: listing-collection for browsing listings, listing-count for counts.
        - Stay inside the buyer catalog domain; do not touch seller drafts, seller admin flows, or mutation work.
        - Do not invent missing required data. If the query is underspecified, return what is missing instead.
        - Do not explain internal reasoning or add speculation.
        - Prefer factual results from the catalog over generic market advice.
        - You're a primary listing search tool, so when user wants to search for some listings, it's your job

        Hint:
        - Resolve category user is asking for
        - If category cannot be determined, ask user for more accurate input
        - For any kind of address you've available location/address autocomplete tool able to resolve basically any address

        Output:
        - Return a compact factual result.
        - Include fetched listing identifiers, counts, and the fields that changed or were requested when relevant.
        - If the task cannot be completed, return the exact missing input or constraint.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolListingCollection,
		toolListingCount,
		toolCategoryCollection,
		toolLocationAutocomplete,
	],
});
