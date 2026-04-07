import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { Effect } from "effect";
import { z } from "zod";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { SystemPrompt } from "~/public/assistant/SystemPrompt";
import { MessageSchema } from "~/public/assistant/schema/MessageSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { Tools } from "~/user/assistant/server/Tools";

export const ChatRequestSchema = z
	.looseObject({
		messages: z.array(MessageSchema),
	})
	.strip();

export const Route = createFileRoute("/api/assistant")({
	server: {
		middleware: [
			withUserMiddleware,
		],
		handlers: {
			async POST({ request, context: { user, database, rootLogger } }) {
				const logger = rootLogger.getChild("/api/assistant");

				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					const aiConfig = ServerAiSchema.parse(process.env);

					const provider = createOpenAICompatible({
						name: "kilo",
						baseURL: aiConfig.SERVER_AI_SERVER_URL,
						apiKey: aiConfig.SERVER_AI_TOKEN,
					});

					const messages = yield* Effect.promise(async () => {
						const { messages } = ChatRequestSchema.parse(await request.json()) as {
							messages: UIMessage[];
						};

						return {
							model: await convertToModelMessages(messages),
							source: messages,
						} as const;
					});

					logger.trace("Running inference", {
						messages,
					});

					return streamText({
						model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
						seed: 64,
						system: SystemPrompt,
						/**
						 * This app has limited subset of schemas, so we've to cheat types here
						 */
						messages: messages.model,
						tools: Tools,
						stopWhen: stepCountIs(8),
					}).toUIMessageStreamResponse({
						originalMessages: messages.source,
						async onFinish({ messages }) {
							logger.trace("Finished streaming!");

							return withTransactionFx(
								Effect.gen(function* () {
									yield* Effect.promise(async () => {
										return kysely
											.deleteFrom("assistant_chat")
											.where("userId", "=", user.id)
											.execute();
									});

									yield* tryDbFx(async () => {
										return kysely
											.insertInto("assistant_chat")
											.values(
												messages.map((message) => ({
													id: genId(),
													createdAt: dateContext.now().toJSDate(),
													payload: message,
													userId: user.id,
												})),
											)
											.executeTakeFirstOrThrow();
									});
								}),
							).pipe(withKyselyFx(database), Effect.runPromise);
						},
					});
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
