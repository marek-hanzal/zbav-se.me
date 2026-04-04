import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";

const ChatSystemPrompt =
	"You are a concise, practical assistant for the embedded zbav-se.me chat experiment.";

type ChatRequestBody = {
	messages: Array<Omit<UIMessage, "id">>;
};

type ModelMessages = Awaited<ReturnType<typeof convertToModelMessages>>;
type ModelMessage = ModelMessages[number];

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			async POST({ request }) {
				const aiConfig = ServerAiSchema.parse(process.env);

				const provider = createOpenAICompatible({
					name: "kilo",
					baseURL: aiConfig.SERVER_AI_SERVER_URL,
					apiKey: aiConfig.SERVER_AI_TOKEN,
				});

				const { messages } = (await request.json()) as ChatRequestBody;

				const modelMessages = await convertToModelMessages(messages);

				const systemMessage: ModelMessage = {
					role: "system",
					content: ChatSystemPrompt,
				};

				return streamText({
					model: provider.chatModel("kilo-auto/free"),
					messages: [
						systemMessage,
						...modelMessages,
					],
				}).toUIMessageStreamResponse();
			},
		},
	},
});
