import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"knowledge",
	"tool",
	"toolKnowledge",
]);

export const toolKnowledge = tool({
	name: "knowledge",
	needsApproval: false,
	description: `
Get one knowledge topic by exact key. Use 'knowledge-search' first if the key is unknown.
    `.trim(),
	parameters: z
		.looseObject({
			input: z.string().describe("Exact key from 'knowledge-search'."),
			withContent: z.boolean().optional().describe("Include full content."),
		})
		.strip(),
	async execute({ withContent, input }) {
		logger.trace("toolKnowledge", {
			withContent,
			input,
		});

		const index = getKnowledgeIndex();
		const topic = index.find((item) => item.data.key === input);

		if (!topic) {
			return {
				found: false,
				key: input,
				error: "Unknown knowledge key. Use 'knowledge-search' first.",
			};
		}

		return {
			found: true,
			key: topic.data.key,
			title: topic.data.title,
			summary: topic.data.summary,
			related: topic.data.related ?? [],
			content: withContent ? topic.content : undefined,
		};
	},
});
