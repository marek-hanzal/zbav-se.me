import { OpenAIProvider, Runner } from "@openai/agents";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { CoreAgent } from "~/user/assistant/CoreAgent";

const aiConfig = ServerAiSchema.parse(process.env);

const runner = new Runner({
	model: aiConfig.SERVER_AI_MODEL,
	modelSettings: {
		reasoning: {
			effort: "low",
		},
	},
	modelProvider: new OpenAIProvider({
		baseURL: aiConfig.SERVER_AI_SERVER_URL,
		apiKey: aiConfig.SERVER_AI_TOKEN,
	}),
});

const response = await runner.run(CoreAgent, "Jak se mas?", {
	// stream: true,
});

console.log(response.finalOutput);
