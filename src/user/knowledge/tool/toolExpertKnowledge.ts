import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getLogger } from "@logtape/logtape";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { toolKnowledge } from "~/public/assistant/knowledge/tool/toolKnowledge";
import { toolKnowledgeIndex } from "~/public/assistant/knowledge/tool/toolKnowledgeIndex";
import { toolKnowledgeSearch } from "~/public/assistant/knowledge/tool/toolKnowledgeSearch";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";

const logger = getLogger("toolExpertKnowledge");

export const toolExpertKnowledge = tool({
	description: `
        When you're asked about some information, you may forward your question to
        this expert, which is another LLM, so keep your prompts short.

        If you want to do some workflow or get information about the system, you may ask this
        expert multiple times to get proper TODO list of actions.
    `.trim(),
	inputSchema: z
		.looseObject({
			prompt: z.string().min(1).describe("A knowledge prompt"),
		})
		.strip(),
	async execute({ prompt }) {
		const aiConfig = ServerAiSchema.parse(process.env);

		logger.trace("Requesting knowledge", {
			prompt,
		});

		const provider = createOpenAICompatible({
			name: "kilo",
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN,
		});

		const { text } = await generateText({
			model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
			prompt,
			system: `
                You're an app knowledge provider, talking to the other LLM, so keep responses
                short and simple, but rich on information.

                Don't hallucinate - it's OK to say "I don't know" than give false information.

                Use knowledge tools to get proper information and compile knowledge into the
                result.
            `.trim(),
			tools: {
				"knowledge-index": toolKnowledgeIndex,
				"knowledge-search": toolKnowledgeSearch,
				knowledge: toolKnowledge,
			},
			stopWhen: stepCountIs(20),
		});

		logger.trace("Knowledge got", {
			text,
		});

		return text;
	},
});
