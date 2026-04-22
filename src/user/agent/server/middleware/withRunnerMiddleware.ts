import { OpenAIProvider, Runner, setTracingDisabled } from "@openai/agents";
import { createMiddleware } from "@tanstack/react-start";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export namespace withRunnerMiddleware {
	export interface Context {
		locale: string;
		cdn: string;
		restriction: RestrictionEnumSchema.Type;
	}
}

export const withRunnerMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
	])
	.server(async ({ next, context: { rootLogger } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withRunnerMiddleware",
		]);

		setTracingDisabled(true);

		const aiConfig = ServerAiSchema.parse(process.env);

		const runner = new Runner({
			workflowName: "zbav-se.me agent",
			model: aiConfig.SERVER_AI_MODEL,
			modelProvider: new OpenAIProvider({
				baseURL: aiConfig.SERVER_AI_SERVER_URL,
				apiKey: aiConfig.SERVER_AI_TOKEN,
			}),
			tracingDisabled: true,
		});

		logger.trace("Config", {
			model: aiConfig.SERVER_AI_MODEL,
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN.substring(0, 6),
		});

		return next({
			context: {
				runner,
			},
		});
	});
