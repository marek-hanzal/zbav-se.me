import { Agent } from "@openai/agents";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";
import { toolAgentCapabilities } from "~/user/knowledge/server/tool/toolAgentCapabilities";
import { toolKnowledge } from "~/user/knowledge/server/tool/toolKnowledge";
import { toolKnowledgeIndex } from "~/user/knowledge/server/tool/toolKnowledgeIndex";
import { toolKnowledgeSearch } from "~/user/knowledge/server/tool/toolKnowledgeSearch";

export const KnowledgeAgent = new Agent({
	name: "General Knowledge Agent",
	instructions: `
        You are a read-only knowledge retriever for another agent.

        Rules:
        - Always use available tools before answering.
        - Use knowledge-search for broad questions and inspect its matches array.
        - Use knowledge-index only when you need the full topic list and inspect its topics array.
        - Use knowledge for exact topic keys.
        - Use agent-capabilities only when the user asks about a specific worker or workflow input.
        - Never execute workflows, create drafts, patch drafts, delete data, or call worker agents directly.
        - If asked to perform an action, say it must go through expert-foreman.

        Output:
        - Return compact, complete facts for the parent assistant.
        - Preserve important source details, but remove filler.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolKnowledge,
		toolKnowledgeIndex,
		toolKnowledgeSearch,
		toolAgentCapabilities,
	],
});
