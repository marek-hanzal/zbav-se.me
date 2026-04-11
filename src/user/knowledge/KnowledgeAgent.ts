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
        - Use knowledge tools for app facts, workflows, and documentation.
        - Use agent-capabilities for questions about what a worker can do or what inputs a workflow needs.
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
