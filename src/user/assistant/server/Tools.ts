import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
// import { toolListingCollection as toolBuyerListingCollection } from "~/buyer/listing/server/tool/toolListingCollection";
// import { toolListingCount as toolBuyerListingCount } from "~/buyer/listing/server/tool/toolListingCount";
// import { toolListingCollection as toolSellerListingCollection } from "~/seller/listing/server/tool/toolListingCollection";
// import { toolListingCount as toolSellerListingCount } from "~/seller/listing/server/tool/toolListingCount";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";

export const Tools = {
	// "knowledge-index": toolKnowledgeIndex,
	// "knowledge-search": toolKnowledgeSearch,
	// knowledge: toolKnowledge,
	//
	// "draft-collection": toolDraftCollection,
	// "draft-fetch": toolDraftFetch,
	// "draft-create": toolDraftCreate,
	// "draft-patch": toolDraftPatch,
	// "draft-delete": toolDraftDelete,
	// "draft-count": toolDraftCount,
	//
	// "seller-listing-collection": toolSellerListingCollection,
	// "seller-listing-count": toolSellerListingCount,
	// "buyer-listing-collection": toolBuyerListingCollection,
	// "buyer-listing-count": toolBuyerListingCount,
	//
	// "location-autocomplete": toolLocationAutocomplete,
	//
	// "category-collection": toolCategoryCollection,
	// "category-fetch": toolCategoryFetch,
	//
	/**
	 * Experimental RAG for accessing knowledge about the app.
	 */
	wiki: tool({
		description: `
            Use this tool to get any knowledge you need about the system.

            On the other side is LLM able to take your prompt, so you can ask whatever you need.

            Returned result is source of truth.
        `.trim(),
		inputSchema: z
			.looseObject({
				prompt: z.string().min(1).describe("A knowledge prompt"),
			})
			.strip(),
		async execute({ prompt }) {
			const aiConfig = ServerAiSchema.parse(process.env);

			const provider = createOpenAICompatible({
				name: "kilo",
				baseURL: aiConfig.SERVER_AI_SERVER_URL,
				apiKey: aiConfig.SERVER_AI_TOKEN,
			});

			return generateText({
				model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
				prompt,
				system: `
                    Na jakékoli otázky odpovídej vtipem (klidně si ho vymysli).
                `,
				// system: `
				//     You're an app knowledge provider, talking to the other LLM, so keep responses
				//     short and simple, but rich on information.

				//     Don't hallucinate - it's OK to say "I don't know" than give false information.

				//     Use knowledge tools to get proper information and compile knowledge into the
				//     result.
				// `.trim(),
				// tools: {
				// 	"knowledge-index": toolKnowledgeIndex,
				// 	"knowledge-search": toolKnowledgeSearch,
				// 	knowledge: toolKnowledge,
				// },
				stopWhen: stepCountIs(20),
			});
		},
	}),
} as const;

export type Tools = typeof Tools;
