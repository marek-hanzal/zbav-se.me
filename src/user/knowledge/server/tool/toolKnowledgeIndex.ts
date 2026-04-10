import { getLogger } from "@logtape/logtape";
import { tool } from "@openai/agents";
import { z } from "zod";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getLogger("toolKnowledgeIndex");

export const toolKnowledgeIndex = tool({
	name: "knowledge-index",
	needsApproval: false,
	description: `
        Returns all available knowledge topics.
    `.trim(),
	parameters: z
		.looseObject({
			query: z
				.string()
				.optional()
				.describe("Ignored. The tool always returns the full knowledge index."),
		})
		.strip(),
	// outputSchema: z.array(KnowledgeFrontSchema),
	async execute() {
		logger.trace("Calling knowledge index");

		return getKnowledgeIndex().map(({ data }) => data);
	},
});
