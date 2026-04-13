import { Agent } from "@openai/agents";
import { toolDraftCollection } from "~/seller/draft/server/tool/toolDraftCollection";
import { toolDraftCount } from "~/seller/draft/server/tool/toolDraftCount";
import { toolDraftCreate } from "~/seller/draft/server/tool/toolDraftCreate";
import { toolDraftDelete } from "~/seller/draft/server/tool/toolDraftDelete";
import { toolDraftPatch } from "~/seller/draft/server/tool/toolDraftPatch";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const DraftAgent = new Agent({
	name: "Seller - Draft Agent",
	instructions: `
        You are a non-user-facing worker for seller listing drafts.

        Rules:
        - Execute only the task given by the foreman.
        - Use the smallest suitable draft tool.
        - Do not invent missing required data; return what is missing instead.
        - Do not explain internal reasoning.
        - User/session scope is already bound by the app; never ask for userId/accountId/sessionId.
        - Use cursor { page: 0, size: 8 } for draft browsing unless the foreman explicitly asks for more.
        - For delete requests, require clear upstream intent and a narrow query.
        - Use English for all tool calls and output.

        Output:
        - Return compact English.
        - Include only draft ids, changed fields, counts, missing inputs, or constraints.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolDraftCollection,
		toolDraftCount,
		toolDraftCreate,
		toolDraftDelete,
		toolDraftPatch,
	],
});
