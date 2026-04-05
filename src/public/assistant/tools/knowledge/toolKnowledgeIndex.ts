import { tool } from "ai";
import Fuse from "fuse.js";
import { z } from "zod";
import { KnowledgeIndex } from "~/public/assistant/Knowledge";

const KnowledgeTopics = Object.values(KnowledgeIndex);

const KnowledgeTopicFuse = new Fuse(KnowledgeTopics, {
	keys: [
		{
			name: "key",
			weight: 0.5,
		},
		{
			name: "title",
			weight: 0.33,
		},
		{
			name: "summary",
			weight: 0.17,
		},
	],
	includeScore: true,
	ignoreLocation: true,
	ignoreFieldNorm: true,
	minMatchCharLength: 1,
	threshold: 1,
});

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
			? KnowledgeTopicFuse.search(normalized).map(({ item }) => item)
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
