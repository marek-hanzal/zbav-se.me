import { tool } from "@openai/agents";
import { z } from "zod";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

export const toolKnowledge = tool({
	name: "knowledge",
	needsApproval: false,
	description: `
        Returns the full content of one knowledge topic by exact key from knowledge-index or knowledge-search.
    `.trim(),
	parameters: z
		.looseObject({
			key: z
				.string()
				.describe(
					"Exact topic key returned by knowledge-index or knowledge-search. Never invent a key.",
				),
		})
		.strip(),
	// outputSchema: z.discriminatedUnion("found", [
	// 	z
	// 		.looseObject({
	// 			found: z
	// 				.literal(false)
	// 				.describe(
	// 					"True - knowledge found, you can proceed, false, knowledge not found, you should tell this to the user",
	// 				),
	// 			key: z.string().describe("Key not found in the knowledge base"),
	// 			error: z
	// 				.string()
	// 				.describe(
	// 					"Explanation what went wrong, you may use this for further decisions of yours",
	// 				),
	// 		})
	// 		.strip(),
	// 	z
	// 		.looseObject({
	// 			found: z
	// 				.literal(true)
	// 				.describe(
	// 					"True - knowledge found, you can proceed, false, knowledge not found, you should tell this to the user",
	// 				),
	// 			key: z.string().describe("Key found in the knowledge base"),
	// 			title: z.string().describe("Short title of the knowledge item"),
	// 			summary: z.string().describe("Short summary of the knowledge (tl;dr)"),
	// 			content: z
	// 				.string()
	// 				.describe(
	// 					"Full content of the knowledge - use only if you're sure you need this",
	// 				),
	// 			related: z
	// 				.array(z.string())
	// 				.describe(
	// 					"You may use this as a direct input to knowledge tool to get related topics",
	// 				),
	// 		})
	// 		.strip(),
	// ]),
	async execute({ key }) {
		const index = getKnowledgeIndex();
		const topic = index.find((item) => item.data.key === key);

		if (!topic) {
			return {
				found: false,
				key,
				error: "Unknown knowledge key. Use knowledge-search or knowledge-index first.",
			};
		}

		return {
			found: true,
			key: topic.data.key,
			title: topic.data.title,
			summary: topic.data.summary,
			related: topic.data.related ?? [],
			content: topic.content,
		};
	},
});
