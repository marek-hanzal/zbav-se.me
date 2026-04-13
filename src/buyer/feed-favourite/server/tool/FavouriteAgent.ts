import { Agent } from "@openai/agents";
import { toolFavouriteRemove } from "~/buyer/favourite/server/tool/toolFavouriteRemove";
import { toolFeedFavouriteCollection } from "~/buyer/feed-favourite/server/tool/toolFeedFavouriteCollection";
import { toolFeedFavouriteCount } from "~/buyer/feed-favourite/server/tool/toolFeedFavouriteCount";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const FavouriteAgent = new Agent({
	name: "Buyer - Favourite Agent",
	instructions: `
        You are a non-user-facing worker for buyer feed favourites.

        Rules:
        - Execute only the task given by the foreman.
        - Use the smallest suitable favourite tool: favourite-remove for removals, favourite-collection for browsing, favourite-count for counts.
        - Stay inside the buyer favourite feed domain; do not touch seller flows, listing mutation logic, or unrelated data.
        - Do not invent missing required data. If the query is underspecified, return what is missing instead.
        - Do not explain internal reasoning or add speculation.
        - User/session scope is already bound by the app; never ask for userId/accountId/sessionId.
        - Use cursor { page: 0, size: 8 } for browsing unless the foreman explicitly asks for more.
        - Use English for all tool calls and output.

        Output:
        - Return compact English.
        - Include only favourite feed ids, counts, requested fields, missing inputs, or constraints.
        - If the task cannot be completed, return the exact missing input or constraint.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolFavouriteRemove,
		toolFeedFavouriteCollection,
		toolFeedFavouriteCount,
	],
});
