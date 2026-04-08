import {
	type AGUIEvent,
	EventSchemas,
	EventType,
	type InputContent,
	type InputContentSource,
	type RunAgentInput,
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
import { match } from "ts-pattern";
import { z } from "zod";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { CoreAgent } from "~/user/assistant/CoreAgent";

const RunAgentInputSchema: z.ZodType<RunAgentInput> = z.object({
	threadId: z.string().min(1),
	runId: z.string().min(1),
	parentRunId: z.string().optional(),
	state: z.unknown(),
	messages: z.array(z.any()),
	tools: z.array(z.any()),
	context: z.array(z.any()),
	forwardedProps: z.unknown(),
});

const UrlStringSchema = z.string().url();

const PartMetadataSchema = z
	.object({
		detail: z
			.enum([
				"low",
				"high",
				"auto",
			])
			.optional(),
		filename: z.string().min(1).optional(),
	})
	.passthrough();

const PartWithMetadataSchema = z
	.object({
		metadata: PartMetadataSchema.optional(),
	})
	.passthrough();

const DeprecatedBinaryInputContentSchema = z
	.object({
		type: z.literal("binary"),
		mimeType: z.string().min(1),
		id: z.string().min(1).optional(),
		data: z.string().min(1).optional(),
		url: z.string().url().optional(),
		filename: z.string().min(1).optional(),
	})
	.passthrough();

const ToolCalledItemSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		arguments: z.unknown().optional(),
	})
	.passthrough();

const ToolOutputItemSchema = z
	.object({
		id: z.string().optional(),
		toolCallId: z.string().optional(),
		output: z.unknown().optional(),
	})
	.passthrough();

type DeprecatedBinaryInputContent = z.infer<typeof DeprecatedBinaryInputContentSchema>;
type AnyInputContent = InputContent | DeprecatedBinaryInputContent;

const emit = <T extends AGUIEvent>(event: T): T => {
	const parsed = EventSchemas.safeParse(event);

	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}

	return event;
};

const serializeUnknown = (value: unknown): string => {
	if (typeof value === "string") {
		return value;
	}

	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};

const inferFilenameFromUrl = (url: string): string | undefined => {
	const parsed = UrlStringSchema.safeParse(url);

	if (!parsed.success) {
		return undefined;
	}

	const pathname = new URL(parsed.data).pathname;
	const last = pathname.split("/").filter(Boolean).at(-1);

	return last || undefined;
};

const getPartMetadata = (part: AnyInputContent) => {
	const parsed = PartWithMetadataSchema.safeParse(part);

	return parsed.success ? parsed.data.metadata : undefined;
};

const getLastUserMessage = (body: RunAgentInput): UserMessage => {
	for (let index = body.messages.length - 1; index >= 0; index--) {
		const message = body.messages.at(index);

		if (!message) {
			continue;
		}

		if (message.role === "user") {
			return message;
		}
	}

	throw new Error("RunAgentInput.messages does not contain a user message.");
};

const normalizeUserContentParts = (content: UserMessage["content"]): AnyInputContent[] => {
	if (typeof content === "string") {
		return [];
	}

	return content.map((part) => {
		const binary = DeprecatedBinaryInputContentSchema.safeParse(part);

		if (binary.success) {
			return binary.data;
		}

		return part;
	});
};

const toOpenAiFileInput = (source: InputContentSource, filename?: string) => {
	return match(source)
		.with(
			{
				type: "url",
			},
			(value) => ({
				type: "input_file" as const,
				file: {
					url: value.value,
				},
				filename,
			}),
		)
		.with(
			{
				type: "data",
			},
			(value) => ({
				type: "input_file" as const,
				file: value.value,
				filename,
			}),
		)
		.exhaustive();
};

const toOpenAiImageInput = (source: InputContentSource, detail?: "low" | "high" | "auto") => {
	return match(source)
		.with(
			{
				type: "url",
			},
			(value) => ({
				type: "input_image" as const,
				image: value.value,
				detail,
			}),
		)
		.with(
			{
				type: "data",
			},
			(value) => ({
				type: "input_image" as const,
				image: `data:${value.mimeType};base64,${value.value}`,
				detail,
			}),
		)
		.exhaustive();
};

const toOpenAiBinaryInput = (part: DeprecatedBinaryInputContent) => {
	const filename =
		part.filename ?? (part.url ? inferFilenameFromUrl(part.url) : undefined) ?? part.id;

	if (part.url) {
		return {
			type: "input_file" as const,
			file: {
				url: part.url,
			},
			filename,
		};
	}

	if (part.id) {
		return {
			type: "input_file" as const,
			file: {
				id: part.id,
			},
			filename,
		};
	}

	if (part.data) {
		return {
			type: "input_file" as const,
			file: part.data,
			filename,
		};
	}

	throw new Error("Binary input does not contain url, id, or data.");
};

const toOpenAiInputContent = (part: AnyInputContent) => {
	return match(part)
		.with(
			{
				type: "text",
			},
			(value) => ({
				type: "input_text" as const,
				text: value.text,
			}),
		)
		.with(
			{
				type: "image",
			},
			(value) => {
				const metadata = getPartMetadata(value);

				return toOpenAiImageInput(value.source, metadata?.detail);
			},
		)
		.with(
			{
				type: "audio",
			},
			(value) => {
				const metadata = getPartMetadata(value);
				const filename =
					metadata?.filename ??
					(value.source.type === "url"
						? inferFilenameFromUrl(value.source.value)
						: undefined);

				return toOpenAiFileInput(value.source, filename);
			},
		)
		.with(
			{
				type: "video",
			},
			(value) => {
				const metadata = getPartMetadata(value);
				const filename =
					metadata?.filename ??
					(value.source.type === "url"
						? inferFilenameFromUrl(value.source.value)
						: undefined);

				return toOpenAiFileInput(value.source, filename);
			},
		)
		.with(
			{
				type: "document",
			},
			(value) => {
				const metadata = getPartMetadata(value);
				const filename =
					metadata?.filename ??
					(value.source.type === "url"
						? inferFilenameFromUrl(value.source.value)
						: undefined);

				return toOpenAiFileInput(value.source, filename);
			},
		)
		.with(
			{
				type: "binary",
			},
			(value) => toOpenAiBinaryInput(value),
		)
		.exhaustive();
};

const toOpenAiCurrentTurn = (body: RunAgentInput): AgentInputItem[] => {
	const userMessage = getLastUserMessage(body);

	if (typeof userMessage.content === "string") {
		return [
			{
				type: "message",
				role: "user",
				content: [
					{
						type: "input_text",
						text: userMessage.content,
					},
				],
			} satisfies AgentInputItem,
		];
	}

	const content = normalizeUserContentParts(userMessage.content).map(toOpenAiInputContent);

	return [
		{
			type: "message",
			role: "user",
			content,
		} satisfies AgentInputItem,
	];
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

				const rawBody = await request.json();
				const bodyResult = RunAgentInputSchema.safeParse(rawBody);

				if (!bodyResult.success) {
					logger.warn("Invalid AG-UI request body", {
						userId: user.id,
						issues: bodyResult.error.issues,
					});

					return Response.json(
						{
							error: "Invalid AG-UI request body",
							issues: bodyResult.error.issues,
						},
						{
							status: 400,
						},
					);
				}

				const body = bodyResult.data;
				const currentTurn = toOpenAiCurrentTurn(body);

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

					const historyRows = yield* Effect.promise(async () => {
						return await kysely
							.selectFrom("assistant_chat")
							.select([
								"payload",
								"sort",
							])
							.orderBy("sort", "asc")
							.execute();
					});

					const initialHistory = historyRows.map(
						({ payload }) => payload as AgentInputItem,
					);
					const initialHistoryLength = initialHistory.length;
					let nextSort = historyRows.at(-1)?.sort ?? 0;

					return yield* Effect.promise(async () => {
						const session = new MemorySession({
							sessionId: body.threadId,
							initialItems: initialHistory,
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

						const appendHistory = async (history: AgentInputItem[]) => {
							const appended = history.slice(initialHistoryLength);

							if (appended.length === 0) {
								return;
							}

							await kysely
								.insertInto("assistant_chat")
								.values(
									appended.map((payload, index) => ({
										id: genId(),
										userId: user.id,
										payload,
										sort: nextSort + index + 1,
									})),
								)
								.execute();

							nextSort += appended.length;
						};

						async function* bridge(): AsyncGenerator<AGUIEvent> {
							let completed: Promise<unknown> | undefined;
							let completedAwaited = false;

							let textMessageId: string | null = null;
							let reasoningMessageId: string | null = null;

							const closeReasoning = (): AGUIEvent[] => {
								if (!reasoningMessageId) {
									return [];
								}

								const events = [
									emit({
										type: EventType.REASONING_MESSAGE_END,
										messageId: reasoningMessageId,
									}),
									emit({
										type: EventType.REASONING_END,
										messageId: reasoningMessageId,
									}),
								];

								reasoningMessageId = null;

								return events;
							};

							const closeText = (): AGUIEvent[] => {
								if (!textMessageId) {
									return [];
								}

								const events = [
									emit({
										type: EventType.TEXT_MESSAGE_END,
										messageId: textMessageId,
									}),
								];

								textMessageId = null;

								return events;
							};

							const awaitCompletedOnce = async () => {
								if (!completed || completedAwaited) {
									return;
								}

								completedAwaited = true;
								await completed;
							};

							try {
								yield emit({
									type: EventType.RUN_STARTED,
									threadId: body.threadId,
									runId: body.runId,
									parentRunId: body.parentRunId,
									input: body,
								});

								const stream = await runner.run(CoreAgent, currentTurn, {
									session,
									sessionInputCallback: (history, newItems) => [
										...history,
										...newItems,
									],
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

												yield emit({
													type: EventType.REASONING_START,
													messageId: reasoningMessageId,
													rawEvent: raw,
												});

												yield emit({
													type: EventType.REASONING_MESSAGE_START,
													messageId: reasoningMessageId,
													role: "reasoning",
													rawEvent: raw,
												});
											}

											if (raw.delta) {
												yield emit({
													type: EventType.REASONING_MESSAGE_CONTENT,
													messageId: reasoningMessageId,
													delta: raw.delta,
													rawEvent: raw,
												});
											}

											continue;
										}

										if (raw.type === "response.output_text.delta") {
											for (const agEvent of closeReasoning()) {
												yield agEvent;
											}

											if (!textMessageId) {
												textMessageId = genId();

												yield emit({
													type: EventType.TEXT_MESSAGE_START,
													messageId: textMessageId,
													role: "assistant",
													rawEvent: raw,
												});
											}

											if (raw.delta) {
												yield emit({
													type: EventType.TEXT_MESSAGE_CONTENT,
													messageId: textMessageId,
													delta: raw.delta,
													rawEvent: raw,
												});
											}

											continue;
										}

										continue;
									}

									if (event.type === "run_item_stream_event") {
										const agEvents = match(event.name)
											.with("tool_called", () => {
												const parsed = ToolCalledItemSchema.safeParse(
													event.item,
												);
												const item = parsed.success
													? parsed.data
													: undefined;

												const toolCallId = item?.id ?? genId();
												const toolCallName = item?.name ?? "unknown_tool";
												const args =
													item?.arguments === undefined
														? undefined
														: serializeUnknown(item.arguments);

												return [
													...closeReasoning(),
													emit({
														type: EventType.TOOL_CALL_START,
														toolCallId,
														toolCallName,
														parentMessageId: textMessageId ?? undefined,
														rawEvent: event,
													}),
													...(args
														? [
																emit({
																	type: EventType.TOOL_CALL_ARGS,
																	toolCallId,
																	delta: args,
																	rawEvent: event,
																}),
															]
														: []),
												];
											})
											.with("tool_output", () => {
												const parsed = ToolOutputItemSchema.safeParse(
													event.item,
												);
												const item = parsed.success
													? parsed.data
													: undefined;

												const toolCallId =
													item?.id ?? item?.toolCallId ?? genId();
												const content =
													item?.output === undefined
														? ""
														: serializeUnknown(item.output);

												return [
													emit({
														type: EventType.TOOL_CALL_END,
														toolCallId,
														rawEvent: event,
													}),
													emit({
														type: EventType.TOOL_CALL_RESULT,
														messageId: genId(),
														toolCallId,
														content,
														role: "tool",
														rawEvent: event,
													}),
												];
											})
											.with(
												"tool_approval_requested",
												"handoff_requested",
												"handoff_occurred",
												"tool_search_called",
												"tool_search_output_created",
												(name) => [
													emit({
														type: EventType.CUSTOM,
														name,
														value: event.item,
														rawEvent: event,
													}),
												],
											)
											.with(
												"message_output_created",
												"reasoning_item_created",
												() => [],
											)
											.otherwise(() => []);

										for (const agEvent of agEvents) {
											yield agEvent;
										}

										continue;
									}

									if (event.type === "agent_updated_stream_event") {
										yield emit({
											type: EventType.CUSTOM,
											name: "agent-updated",
											value: event.agent,
											rawEvent: event,
										});
									}
								}

								await awaitCompletedOnce();
								await appendHistory(stream.history);

								for (const agEvent of closeReasoning()) {
									yield agEvent;
								}

								for (const agEvent of closeText()) {
									yield agEvent;
								}

								yield emit({
									type: EventType.RUN_FINISHED,
									threadId: body.threadId,
									runId: body.runId,
									result: stream.finalOutput,
								});
							} catch (error) {
								const isAbort =
									error instanceof DOMException && error.name === "AbortError";

								logger[isAbort ? "warn" : "error"]("Assistant stream failed", {
									userId: user.id,
									error,
								});

								yield emit({
									type: EventType.RUN_ERROR,
									message: error instanceof Error ? error.message : String(error),
									code: isAbort ? "ABORT_ERR" : undefined,
								});
							} finally {
								try {
									await awaitCompletedOnce();
								} catch (error) {
									logger.warn("Assistant stream completion failed", {
										userId: user.id,
										error,
									});
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
