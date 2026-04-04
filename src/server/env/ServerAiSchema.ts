import { z } from "zod";

export const ServerAiSchema = z
	.looseObject({
		SERVER_AI_TOKEN: z.string().min(1, "AI token is required"),
		SERVER_AI_SERVER_URL: z.url("AI server URL is required"),
		SERVER_AI_MODEL: z.string().min(1, "AI model is required"),
	})
	.strip()
	.meta({
		id: "ServerAi",
		description: "Environment variables required to talk to the Kilo Gateway.",
	});

export type ServerAiSchema = typeof ServerAiSchema;

export namespace ServerAiSchema {
	export type Type = z.infer<ServerAiSchema>;
}
