import { tool } from "ai";
import { z } from "zod";
import { KnowledgeIndex } from "~/public/assistant/Knowledge";

const KnowledgeTopics = Object.values(KnowledgeIndex);

export const toolKnowledgeIndex = tool({
	title: "knowledge-index",
	type: "function",
	needsApproval: false,
	description: `
        Returns all available knowledge topics. Use this first when you need exact topic keys or when the
        user's question is about product behavior, feature rules, limits, pricing, statuses, or help content.        
    `.trim(),
	inputSchema: z
		.looseObject({
			query: z
				.string()
				.optional()
				.describe(
					"Optional user question or keywords used to prioritize the most relevant topics.",
				),
		})
		.strip(),
	async execute({ query }) {
		const normalized = query?.trim().toLowerCase();

		const topics = normalized
			? [
					...KnowledgeTopics,
				].sort((a, b) => {
					const aScore =
						Number(a.key.includes(normalized)) * 3 +
						Number(a.title.toLowerCase().includes(normalized)) * 2 +
						Number(a.summary.toLowerCase().includes(normalized));

					const bScore =
						Number(b.key.includes(normalized)) * 3 +
						Number(b.title.toLowerCase().includes(normalized)) * 2 +
						Number(b.summary.toLowerCase().includes(normalized));

					return bScore - aScore;
				})
			: KnowledgeTopics;

		return {
			topics: topics.map(({ key, title, summary, related }) => ({
				key,
				title,
				summary,
				related,
			})),
		};
	},
});
