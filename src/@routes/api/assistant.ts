import { MemorySession, OpenAIProvider, Runner, type AgentInputItem } from "@openai/agents";
import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { CoreAgent } from "~/user/assistant/CoreAgent";
export const Route = createFileRoute("/api/assistant")({
	server: {
		middleware: [
			withUserMiddleware,
		],
		handlers: {
			async POST({ request, context: { user, database, rootLogger } }) {
				const logger = rootLogger.getChild("/api/assistant");
				logger.trace("Requested inference", {
					userId: user.id,
				});

				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					const aiConfig = ServerAiSchema.parse(process.env);

					const runner = new Runner({
						model: aiConfig.SERVER_AI_MODEL,
						modelProvider: new OpenAIProvider({
							baseURL: aiConfig.SERVER_AI_SERVER_URL,
							apiKey: aiConfig.SERVER_AI_TOKEN,
						}),
						tracingDisabled: true,
					});

					const messages = yield* Effect.promise(async () => {
						const items = await kysely
							.selectFrom("assistant_chat")
							.select("payload")
							.orderBy("sort", "asc")
							.execute();

						return items.map(({ payload }) => payload as AgentInputItem);
					});

					const stream = yield* Effect.promise(async () => {
						return runner.run(CoreAgent, "nextInput", {
							session: new MemorySession({
								sessionId: `${user.id}`,
								initialItems: messages,
								logger: {
									namespace: `${user.id}`,
									dontLogModelData: false,
									dontLogToolData: false,
									debug(message) {
										return logger.debug(message);
									},
									error(message) {
										return logger.error(message);
									},
									warn(message) {
										return logger.warn(message);
									},
								},
							}),
							stream: true,
							// signal: abortController.signal,
						});
					});

					return Response.json({
						error: "not yet",
					});
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
