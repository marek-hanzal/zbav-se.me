import { tool } from "@openai/agents";
import Fuse from "fuse.js";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"knowledge",
	"tool",
	"toolKnowledge",
]);

const InputSchema = z
	.looseObject({
		query: z.string().describe("Search query."),
		limit: z.coerce.number().int().positive().max(20).optional().describe("Max results."),
		withContent: z.boolean().optional().default(false),
	})
	.strip();

export const toolKnowledge = tool({
	name: "knowledge",
	needsApproval: false,
	description: `
Search knowledge topics by query or exact key.
Return the best matching topics.
Set withContent to include full topic content.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolKnowledge", {
			input,
		});

		const { query, limit, withContent } = await InputSchema.parseAsync(input);

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
						content: withContent ? item.content : undefined,
						score: score ?? 0,
					}) as const,
			);

		return {
			matches,
		};
	},
});
