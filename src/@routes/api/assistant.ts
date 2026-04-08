import {
	type AGUIEvent,
	type CustomEvent,
	EventType,
	type RunAgentInput,
	type TextInputContent,
	type UserMessage,
} from "@ag-ui/core";
import {
	type AgentInputItem,
	isOpenAIResponsesRawModelStreamEvent,
	MemorySession,
	OpenAIProvider,
	Runner,
} from "@openai/agents";
import { toServerSentEventsResponse } from "@tanstack/ai";
import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { CoreAgent } from "~/user/assistant/CoreAgent";

const extractUserText = (body: RunAgentInput): string => {
	for (let index = body.messages.length - 1; index >= 0; index--) {
		const message = body.messages[index];

		if (!message || message.role !== "user") {
			continue;
		}

		const userMessage = message as UserMessage;

		if (typeof userMessage.content === "string") {
			return userMessage.content.trim();
		}

		const text = userMessage.content
			.filter((part): part is TextInputContent => part.type === "text")
			.map((part) => part.text)
			.join("\n")
			.trim();

		if (text.length > 0) {
			return text;
		}
	}

	return "";
};

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

				const body = (await request.json()) as RunAgentInput;
				const input = extractUserText(body);

				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					void dateContext;

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

					return yield* Effect.promise(async () => {
						const session = new MemorySession({
							sessionId: body.threadId,
							initialItems: messages,
							logger: {
								namespace: body.threadId,
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
						});

						async function* bridge(): AsyncGenerator<AGUIEvent> {
							let completed: Promise<unknown> | undefined;
							let textMessageId: string | null = null;
							let reasoningMessageId: string | null = null;

							const closeReasoning = function* (): Generator<AGUIEvent> {
								if (!reasoningMessageId) {
									return;
								}

								yield {
									type: EventType.REASONING_MESSAGE_END,
									messageId: reasoningMessageId,
								};

								yield {
									type: EventType.REASONING_END,
									messageId: reasoningMessageId,
								};

								reasoningMessageId = null;
							};

							const closeText = function* (): Generator<AGUIEvent> {
								if (!textMessageId) {
									return;
								}

								yield {
									type: EventType.TEXT_MESSAGE_END,
									messageId: textMessageId,
								};

								textMessageId = null;
							};

							try {
								yield {
									type: EventType.RUN_STARTED,
									threadId: body.threadId,
									runId: body.runId,
									parentRunId: body.parentRunId,
									input: body,
								};

								const stream = await runner.run(CoreAgent, input, {
									session,
									stream: true,
									signal: request.signal,
								});

								completed = stream.completed;

								for await (const event of stream) {
									if (isOpenAIResponsesRawModelStreamEvent(event)) {
										const raw = event.data.event;

										if (raw.type === "response.reasoning_summary_text.delta") {
											if (!reasoningMessageId) {
												reasoningMessageId = genId();

												yield {
													type: EventType.REASONING_START,
													messageId: reasoningMessageId,
													rawEvent: raw,
												};

												yield {
													type: EventType.REASONING_MESSAGE_START,
													messageId: reasoningMessageId,
													role: "reasoning",
													rawEvent: raw,
												};
											}

											if (raw.delta) {
												yield {
													type: EventType.REASONING_MESSAGE_CONTENT,
													messageId: reasoningMessageId,
													delta: raw.delta,
													rawEvent: raw,
												};
											}

											continue;
										}

										if (raw.type === "response.output_text.delta") {
											yield* closeReasoning();

											if (!textMessageId) {
												textMessageId = genId();

												yield {
													type: EventType.TEXT_MESSAGE_START,
													messageId: textMessageId,
													role: "assistant",
													rawEvent: raw,
												};
											}

											if (raw.delta) {
												yield {
													type: EventType.TEXT_MESSAGE_CONTENT,
													messageId: textMessageId,
													delta: raw.delta,
													rawEvent: raw,
												};
											}

											continue;
										}
									}

									if (event.type === "run_item_stream_event") {
										switch (event.name) {
											case "tool_called": {
												yield* closeReasoning();

												const item = event.item as {
													id?: string;
													name?: string;
													arguments?: unknown;
												};

												const toolCallId = item.id ?? genId();
												const toolCallName = item.name ?? "unknown_tool";

												yield {
													type: EventType.TOOL_CALL_START,
													toolCallId,
													toolCallName,
													parentMessageId: textMessageId ?? undefined,
													rawEvent: event,
												};

												if (item.arguments !== undefined) {
													const args =
														typeof item.arguments === "string"
															? item.arguments
															: JSON.stringify(item.arguments);

													if (args) {
														yield {
															type: EventType.TOOL_CALL_ARGS,
															toolCallId,
															delta: args,
															rawEvent: event,
														};
													}
												}

												break;
											}

											case "tool_output": {
												const item = event.item as {
													id?: string;
													toolCallId?: string;
													output?: unknown;
												};

												const toolCallId =
													item.id ?? item.toolCallId ?? genId();
												const content =
													typeof item.output === "string"
														? item.output
														: item.output == null
															? ""
															: JSON.stringify(item.output);

												yield {
													type: EventType.TOOL_CALL_END,
													toolCallId,
													rawEvent: event,
												};

												yield {
													type: EventType.TOOL_CALL_RESULT,
													messageId: genId(),
													toolCallId,
													content,
													role: "tool",
													rawEvent: event,
												};

												break;
											}

											case "tool_approval_requested":
											case "handoff_requested":
											case "handoff_occurred":
											case "tool_search_called":
											case "tool_search_output_created": {
												yield {
													type: EventType.CUSTOM,
													name: event.name,
													value: event.item,
													rawEvent: event,
												} satisfies CustomEvent;
												break;
											}

											case "message_output_created":
											case "reasoning_item_created": {
												break;
											}
										}
									}

									if (event.type === "agent_updated_stream_event") {
										yield {
											type: EventType.CUSTOM,
											name: "agent-updated",
											value: event.agent,
											rawEvent: event,
										};
									}
								}

								yield* closeReasoning();
								yield* closeText();

								yield {
									type: EventType.RUN_FINISHED,
									threadId: body.threadId,
									runId: body.runId,
									result: stream.finalOutput,
								};
							} catch (error) {
								const isAbort =
									error instanceof DOMException && error.name === "AbortError";

								logger[isAbort ? "warn" : "error"]("Assistant stream failed", {
									userId: user.id,
									error,
								});

								yield {
									type: EventType.RUN_ERROR,
									message: error instanceof Error ? error.message : String(error),
									code: isAbort ? "ABORT_ERR" : undefined,
								};
							} finally {
								if (completed) {
									try {
										await completed;
									} catch (error) {
										logger.warn("Assistant stream completion failed", {
											userId: user.id,
											error,
										});
									}
								}
							}
						}

						return toServerSentEventsResponse(bridge());
					});
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
