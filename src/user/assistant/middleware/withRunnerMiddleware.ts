import { OpenAIProvider, Runner } from "@openai/agents";
import { createMiddleware } from "@tanstack/react-start";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";

export const withRunnerMiddleware = createMiddleware().server(async ({ next }) => {
	const aiConfig = ServerAiSchema.parse(process.env);

	const runner = new Runner({
		model: aiConfig.SERVER_AI_MODEL,
		modelProvider: new OpenAIProvider({
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN,
		}),
		tracingDisabled: true,
	});

	return next({
		context: {
			runner,
		},
	});
});
