import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { SystemPrompt } from "~/public/assistant/SystemPrompt";
import { MessageSchema } from "~/public/assistant/schema/MessageSchema";
import { toolKnowledge } from "~/public/assistant/knowledge/tool/toolKnowledge";
import { toolKnowledgeIndex } from "~/public/assistant/knowledge/tool/toolKnowledgeIndex";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";

export const ChatRequestSchema = z
	.looseObject({
		messages: z.array(
			MessageSchema.omit({
				id: true,
			}),
		),
	})
	.strip();

export const Route = createFileRoute("/api/assistant")({
	server: {
		handlers: {
			async POST({ request }) {
				const aiConfig = ServerAiSchema.parse(process.env);

				const provider = createOpenAICompatible({
					name: "kilo",
					baseURL: aiConfig.SERVER_AI_SERVER_URL,
					apiKey: aiConfig.SERVER_AI_TOKEN,
				});

				const { messages } = ChatRequestSchema.parse(await request.json());

				return streamText({
					model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
					system: SystemPrompt,
					/**
					 * This app has limited subset of schemas, so we've to cheat types here
					 */
					messages: await convertToModelMessages(messages as UIMessage[]),
					tools: {
						"knowledge-index": toolKnowledgeIndex,
						knowledge: toolKnowledge,
					} as const,
					stopWhen: stepCountIs(5),
				}).toUIMessageStreamResponse();
			},
		},
	},
});
