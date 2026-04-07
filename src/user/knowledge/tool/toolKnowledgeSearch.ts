import { tool } from "ai";
import Fuse from "fuse.js";
import { z } from "zod";
import { KnowledgeFrontSchema } from "~/user/knowledge/schema/KnowledgeFrontSchema";
import { getKnowledgeIndex } from "~/user/knowledge/service/getKnowledgeIndex";

export const toolKnowledgeSearch = tool({
	title: "knowledge-search",
	type: "function",
	needsApproval: false,
	description:
		"Fuzzy searches all knowledge topics, including front-matter and content, and returns the best matches.",
	inputSchema: z
		.looseObject({
			query: z
				.string()
				.describe(
					"User query or keywords used to search across knowledge topic keys, titles, summaries, and content.",
				),
			limit: z.coerce
				.number()
				.int()
				.positive()
				.max(20)
				.optional()
				.describe("Optional maximum number of topics to return."),
		})
		.strip(),
	outputSchema: z.array(
		z
			.looseObject({
				...KnowledgeFrontSchema.shape,
				score: z.number(),
			})
			.strip(),
	),
	async execute({ query, limit }) {
		const normalized = query.trim();
		const index = getKnowledgeIndex().map(
			({ content, data }) =>
				({
					...data,
					content,
				}) as const,
		);

		const fuse = new Fuse(index, {
			keys: [
				{
					name: "key",
					weight: 0.35,
				},
				{
					name: "title",
					weight: 0.25,
				},
				{
					name: "summary",
					weight: 0.2,
				},
				{
					name: "content",
					weight: 0.2,
				},
			],
			includeScore: true,
			ignoreLocation: true,
			ignoreFieldNorm: true,
			minMatchCharLength: 1,
			threshold: 0.35,
		});

		return fuse
			.search(normalized, {
				limit: limit ?? 8,
			})
			.map(
				({ item, score }) =>
					({
						key: item.key,
						title: item.title,
						summary: item.summary,
						related: item.related ?? [],
						score: score ?? 0,
					}) as const,
			);
	},
});
