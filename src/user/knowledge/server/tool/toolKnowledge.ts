import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"tool",
	"toolKnowledge",
]);

export const toolKnowledge = tool({
	name: "knowledge",
	needsApproval: false,
	description: `
        Returns the full content of one knowledge topic by exact key from knowledge-index or knowledge-search.
    `.trim(),
	parameters: z
		.looseObject({
			input: z
				.string()
				.describe(
					"Exact topic key returned by knowledge-index or knowledge-search. Never invent a key.",
				),
		})
		.strip(),
	async execute({ input }) {
		logger.trace("toolKnowledge", {
			key: input,
		});

		const index = getKnowledgeIndex();
		const topic = index.find((item) => item.data.key === input);

		if (!topic) {
			return {
				found: false,
				key: input,
				error: "Unknown knowledge key. Use knowledge-search or knowledge-index first.",
			};
		}

		return {
			found: true,
			key: topic.data.key,
			title: topic.data.title,
			summary: topic.data.summary,
			related: topic.data.related ?? [],
			content: topic.content,
		};
	},
});
