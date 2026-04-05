import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type ModelMessage, streamText } from "ai";
import { z } from "zod";
import { SystemPrompt } from "~/public/assistant/SystemPrompt";
import { MessageSchema } from "~/public/assistant/schema/MessageSchema";
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

				const modelMessages = await convertToModelMessages(messages);

				const systemMessage: ModelMessage = {
					role: "system",
					content: SystemPrompt,
				};

				return streamText({
					model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
					messages: [
						systemMessage,
						...modelMessages,
					],
				}).toUIMessageStreamResponse();
			},
		},
	},
});
