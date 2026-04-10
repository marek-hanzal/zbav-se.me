import { Agent } from "@openai/agents";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";
import { toolKnowledge } from "~/user/knowledge/server/tool/toolKnowledge";
import { toolKnowledgeIndex } from "~/user/knowledge/server/tool/toolKnowledgeIndex";
import { toolKnowledgeSearch } from "~/user/knowledge/server/tool/toolKnowledgeSearch";

export const KnowledgeAgent = new Agent({
	name: "General Knowledge Agent",
	instructions: `
        Your role is knowledge retriever. You'll be asked for various knowledge pieces you've
        to find in tools available to you.

        Always use tool to check the knowledge and compile output (target is another LLM not a user).

        Don't strip any information from the sources, but you may rephrase it.
    `.trim(),
	modelSettings: {
		frequencyPenalty: 1.15,
		temperature: 0.2,
		reasoning: {
			effort: "high",
		},
		text: {
			verbosity: "high",
		},
		toolChoice: "required",
	},
	tools: [
		toolKnowledge,
		toolKnowledgeIndex,
		toolKnowledgeSearch,
		//
		DraftAgent.asTool({
			toolDescription: `
                Use to get a knowledge, what tools are available for Drafts.
            `.trim(),
		}),
		//
		LocationAgent.asTool({
			toolDescription: `
                Use to get a knowledge, what is available for location/address autocomplete/normalization.
            `.trim(),
		}),
	],
});
