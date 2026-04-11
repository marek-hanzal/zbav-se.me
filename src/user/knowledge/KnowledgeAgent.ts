import { Agent } from "@openai/agents";
import { ToolModelSettings } from "~/user/agent/model/ToolModelSettings";
import { toolAgentCapabilities } from "~/user/knowledge/server/tool/toolAgentCapabilities";
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

        You're read-only. You retrieve knowledge and inspect capabilities, but you never execute
        user workflows, create drafts, patch drafts, delete data, or call worker agents directly.

        If user asks what is needed for a workflow or what a worker can do, use agent-capabilities.
        If user asks you to perform the workflow, refuse and say it must go through expert-foreman.
    `.trim(),
	modelSettings: ToolModelSettings,
	tools: [
		toolKnowledge,
		toolKnowledgeIndex,
		toolKnowledgeSearch,
		toolAgentCapabilities,
	],
});
