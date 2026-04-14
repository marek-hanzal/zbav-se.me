import { tool } from "@openai/agents";
import Fuse from "fuse.js";
import { z } from "zod";
import { getRootLogger } from "~/server/log/getRootLogger";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"tool",
	"toolKnowledgeSearch",
]);

export const toolKnowledgeSearch = tool({
	name: "knowledge-search",
	needsApproval: false,
	description: `
        Compact fuzzy search across knowledge topics.

        Use when the user asks a domain/process question and you need the most relevant internal knowledge topic. Returns topic metadata, not full content; call knowledge with an exact key when you need the body.
    `.trim(),
	parameters: z
		.looseObject({
			input: z
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
