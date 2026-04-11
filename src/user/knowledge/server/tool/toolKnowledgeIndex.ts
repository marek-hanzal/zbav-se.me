import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"tool",
	"toolKnowledgeIndex",
]);

export const toolKnowledgeIndex = tool({
	name: "knowledge-index",
	needsApproval: false,
	description: `
        Returns all available knowledge topics.
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
