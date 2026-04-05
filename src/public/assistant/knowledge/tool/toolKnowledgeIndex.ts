import { getLogger } from "@logtape/logtape";
import { tool } from "ai";
import { z } from "zod";
import { KnowledgeFrontSchema } from "~/public/assistant/knowledge/schema/KnowledgeFrontSchema";
import { getKnowledgeIndex } from "~/public/assistant/knowledge/service/getKnowledgeIndex";

const logger = getLogger("toolKnowledgeIndex");

export const toolKnowledgeIndex = tool({
	title: "knowledge-index",
	type: "function",
	needsApproval: false,
	description: `
        Returns all available knowledge topics.
    `.trim(),
	inputSchema: z
		.looseObject({
			query: z
				.string()
				.optional()
				.describe("Ignored. The tool always returns the full knowledge index."),
		})
		.strip(),
	outputSchema: z.array(KnowledgeFrontSchema),
	async execute() {
		logger.debug("Calling knowledge index");

		return getKnowledgeIndex().map(({ data }) => data);
	},
});
