import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"knowledge",
	"tool",
	"toolKnowledgeIndex",
]);

export const toolKnowledgeIndex = tool({
	name: "knowledge-index",
	needsApproval: false,
	description: `
Return metadata for all available knowledge topics.

Hint:
- Returns complete knowledge index (context heavy)
- It's cheaper to use multiple calls to 'knowledge-search' than using 'knowledge-index'

Boundaries:
- Prefer using 'knowledge-search' over 'knowledge-index'
    `.trim(),
	parameters: z
		.looseObject({
			input: z
				.string()
				.optional()
				.describe("Ignored. The tool always returns the full knowledge index."),
		})
		.strip(),
	async execute() {
		logger.trace("toolKnowledgeIndex");

		const topics = getKnowledgeIndex().map(({ data }) => data);

		return {
			count: topics.length,
			topics,
		};
	},
});
