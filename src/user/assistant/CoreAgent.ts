import { Agent } from "@openai/agents";
import { KnowledgeAgent } from "~/user/knowledge/KnowledgeAgent";

export const CoreAgent = Agent.create({
	name: "Core Product Agent",
	instructions: `
        All answers in Czech.

        You're the managing agent for the product.

        You should choose the sub-agent which will pick-up and do the work; if such sub-agent
        is not available, user is probably asking question you should politely refuse to answer.

        Start with Knowledge Agent who will give you context user needs to do; if there is no such
        answer or Knowledge Agent does not know, question is probably out of scope of your assistance.
    `.trim(),
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
