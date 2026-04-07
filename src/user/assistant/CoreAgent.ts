import { Agent } from "@openai/agents";
import { KnowledgeAgent } from "~/user/knowledge/KnowledgeAgent";
import prompt from "./system-prompt.md?raw";

export const CoreAgent = Agent.create({
	name: "Core Product Agent",
	instructions: prompt.trim(),
	tools: [
		KnowledgeAgent.asTool({
			toolName: "expert-knowledge",
			toolDescription: `
                Knowledge source for questions about this application, it's abilities, features, other
                available agents/tools.
            `.trim(),
		}),
	],
	handoffs: [
		/**
		 * Here we may create specialized agents
		 */
	],
});
