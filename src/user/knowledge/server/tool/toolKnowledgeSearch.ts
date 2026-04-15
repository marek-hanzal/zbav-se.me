import { tool } from "@openai/agents";
import Fuse from "fuse.js";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"knowledge",
	"tool",
	"toolKnowledgeSearch",
]);

export const toolKnowledgeSearch = tool({
	name: "knowledge-search",
	needsApproval: false,
	description: `
Search app knowledge topics by query. Use for app behavior, features, rules, and capabilities. Not for user data.
    `.trim(),
	parameters: z
		.looseObject({
			input: z.string().describe("Search query."),
			limit: z.coerce.number().int().positive().max(20).optional().describe("Max results."),
		})
		.strip(),
	async execute({ input, limit }) {
		logger.trace("toolKnowledgeSearch", {
			query: input,
			limit,
		});

		const normalized = input.trim();
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

		const matches = fuse
			.search(normalized, {
				limit,
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

		return {
			query: normalized,
			count: matches.length,
			matches,
		};
	},
});
