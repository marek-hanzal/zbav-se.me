import { Agent } from "@openai/agents";
import { toolDraftCollection } from "~/seller/draft/server/tool/toolDraftCollection";
import { toolDraftCount } from "~/seller/draft/server/tool/toolDraftCount";
import { toolDraftCreate } from "~/seller/draft/server/tool/toolDraftCreate";
import { toolDraftDelete } from "~/seller/draft/server/tool/toolDraftDelete";
import { toolDraftPatch } from "~/seller/draft/server/tool/toolDraftPatch";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";

export const DraftAgent = new Agent({
	name: "Seller - Draft Agent Worker",
	instructions: `
        You should just take input and do, whatever it says with minimal, compact output
        as you're worker agent under the managing agent.
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
