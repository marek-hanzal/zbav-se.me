import {
	type AGUIEvent,
	EventSchemas,
	EventType,
	type InputContent,
	type InputContentSource,
	type RunAgentInput,
} from "@ag-ui/core";
import {
	type AgentInputItem,
	isOpenAIResponsesRawModelStreamEvent,
	MemorySession,
	OpenAIProvider,
	Runner,
} from "@openai/agents";
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

const PartMetadataSchema = z
	.looseObject({
		detail: z
			.enum([
				"low",
				"high",
				"auto",
			])
			.optional(),
		filename: z.string().min(1).optional(),
		transcript: z.string().min(1).optional(),
	})
	.strip();

const PartWithMetadataSchema = z
	.looseObject({
		metadata: PartMetadataSchema.optional(),
	})
	.strip();

const DeprecatedBinaryInputContentSchema = z
	.looseObject({
		type: z.literal("binary"),
		mimeType: z.string().min(1),
		id: z.string().min(1).optional(),
		data: z.string().min(1).optional(),
		url: z.url().optional(),
		filename: z.string().min(1).optional(),
	})
	.strip();

const ToolCalledItemSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		callId: z.string().min(1).optional(),
		call_id: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
		namespace: z.string().min(1).optional(),
		arguments: z.unknown().optional(),
		status: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
	})
	.strip();

const ToolOutputItemSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		callId: z.string().min(1).optional(),
		call_id: z.string().min(1).optional(),
		toolCallId: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
		namespace: z.string().min(1).optional(),
		output: z.unknown().optional(),
		status: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
	})
	.strip();

const AgUiFunctionCallSchema = z
	.looseObject({
		name: z.string().min(1),
		arguments: z.string(),
	})
	.strip();

const AgUiToolCallSchema = z
	.looseObject({
		id: z.string().min(1),
		type: z.literal("function"),
		function: AgUiFunctionCallSchema,
	})
	.strip();

const AgUiUserMessageSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		role: z.literal("user"),
		content: z.union([
			z.string(),
			z.array(z.unknown()),
		]),
		name: z.string().min(1).optional(),
	})
	.strip();

const AgUiAssistantMessageSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		role: z.literal("assistant"),
		content: z.string().optional(),
		name: z.string().min(1).optional(),
		toolCalls: z.array(AgUiToolCallSchema).optional(),
	})
	.strip();

const AgUiSystemMessageSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		role: z.literal("system"),
		content: z.string(),
		name: z.string().min(1).optional(),
	})
	.strip();

const AgUiDeveloperMessageSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		role: z.literal("developer"),
		content: z.string(),
		name: z.string().min(1).optional(),
	})
	.strip();

const AgUiToolMessageSchema = z
	.looseObject({
		id: z.string().min(1).optional(),
		role: z.literal("tool"),
		content: z.string(),
		toolCallId: z.string().min(1),
		error: z.string().min(1).optional(),
	})
	.strip();

type DeprecatedBinaryInputContent = z.infer<typeof DeprecatedBinaryInputContentSchema>;
type AnyInputContent = InputContent | DeprecatedBinaryInputContent;
type ParsedToolCalledItem = z.infer<typeof ToolCalledItemSchema>;
type ParsedToolOutputItem = z.infer<typeof ToolOutputItemSchema>;
type ParsedAgUiToolCall = z.infer<typeof AgUiToolCallSchema>;
type OpenAiUserContentPart =
	| {
			type: "input_text";
			text: string;
	  }
	| {
			type: "input_image";
			image: string;
			detail?: "low" | "high" | "auto";
	  }
	| {
			type: "input_file";
			file:
				| string
				| {
						id: string;
				  }
				| {
						url: string;
				  };
			filename?: string;
	  }
	| {
			type: "audio";
			audio:
				| string
				| {
						id: string;
				  };
			format?: string;
			transcript?: string;
	  };

type OpenAiConversationInput = {
	initialHistory: AgentInputItem[];
	currentTurn: AgentInputItem[];
};

let runnerInstance: Runner | undefined;

const getRunner = () => {
	if (runnerInstance) {
		return runnerInstance;
	}

	const aiConfig = ServerAiSchema.parse(process.env);

	runnerInstance = new Runner({
		model: aiConfig.SERVER_AI_MODEL,
		modelProvider: new OpenAIProvider({
			baseURL: aiConfig.SERVER_AI_SERVER_URL,
			apiKey: aiConfig.SERVER_AI_TOKEN,
		}),
		tracingDisabled: true,
	});

	return runnerInstance;
};

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
	const parsed = z.url().safeParse(url);

	if (!parsed.success) {
		return undefined;
	}

	return new URL(parsed.data).pathname.split("/").filter(Boolean).at(-1);
};

const inferFormatFromMimeType = (mimeType?: string): string | undefined => {
	if (!mimeType) {
		return undefined;
	}

	const [, subtype] = mimeType.split("/");

	if (!subtype) {
		return undefined;
	}

	return subtype.split(";")[0]?.trim() || undefined;
};

const getPartMetadata = (part: AnyInputContent) => {
	const parsed = PartWithMetadataSchema.safeParse(part);

	return parsed.success ? parsed.data.metadata : undefined;
};

const normalizeUserContentParts = (content: string | AnyInputContent[]): AnyInputContent[] => {
	if (typeof content === "string") {
		return [];
	}

	return content.map((part) => {
		const binary = DeprecatedBinaryInputContentSchema.safeParse(part);

		if (binary.success) {
			return binary.data;
		}

		return part as AnyInputContent;
	});
};

const toOpenAiFileReference = (source: InputContentSource) => {
	return match(source)
		.with(
			{
				type: "url",
			},
			(value) => ({
				url: value.value,
			}),
		)
		.with(
			{
				type: "data",
			},
			(value) => value.value,
		)
		.exhaustive();
};

const toOpenAiFileInput = (source: InputContentSource, filename?: string) => {
	return {
		type: "input_file",
		file: toOpenAiFileReference(source),
		filename,
	} satisfies OpenAiUserContentPart;
};

const toOpenAiImageInput = (
	source: InputContentSource,
	detail?: "low" | "high" | "auto",
): OpenAiUserContentPart => {
	return match(source)
		.with(
			{
				type: "url",
			},
			(value) =>
				({
					type: "input_image",
					image: value.value,
					detail,
				}) as const,
		)
		.with(
			{
				type: "data",
			},
			(value) =>
				({
					type: "input_image",
					image: `data:${value.mimeType};base64,${value.value}`,
					detail,
				}) as const,
		)
		.exhaustive();
};

const toOpenAiAudioInput = (
	source: InputContentSource,
	transcript?: string,
): OpenAiUserContentPart => {
	return match(source)
		.with(
			{
				type: "url",
			},
			(value) => ({
				type: "audio",
				audio: value.value,
				format: inferFormatFromMimeType(value.mimeType),
				transcript,
			}),
		)
		.with(
			{
				type: "data",
			},
			(value) => ({
				type: "audio",
				audio: `data:${value.mimeType};base64,${value.value}`,
				format: inferFormatFromMimeType(value.mimeType),
				transcript,
			}),
		)
		.exhaustive();
};

const toOpenAiBinaryInput = (part: DeprecatedBinaryInputContent): OpenAiUserContentPart => {
	const filename =
		part.filename ?? (part.url ? inferFilenameFromUrl(part.url) : undefined) ?? part.id;

	if (part.url) {
		return {
			type: "input_file",
			file: {
				url: part.url,
			},
			filename,
		};
	}

	if (part.id) {
		return {
			type: "input_file",
			file: {
				id: part.id,
			},
			filename,
		};
	}

	if (part.data) {
		return {
			type: "input_file",
			file: part.data,
			filename,
		};
	}

	throw new Error("Binary input does not contain url, id, or data.");
};

const toOpenAiInputContent = (part: AnyInputContent): OpenAiUserContentPart => {
	return match(part)
		.with(
			{
				type: "text",
			},
			(value) => ({
				type: "input_text",
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

				return toOpenAiAudioInput(value.source, metadata?.transcript);
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

const toOpenAiUserMessage = (message: z.infer<typeof AgUiUserMessageSchema>): AgentInputItem => {
	if (typeof message.content === "string") {
		return {
			type: "message",
			id: message.id,
			role: "user",
			content: message.content,
		} satisfies AgentInputItem;
	}

	const content = normalizeUserContentParts(message.content).map(toOpenAiInputContent);

	return {
		type: "message",
		id: message.id,
		role: "user",
		content,
	} satisfies AgentInputItem;
};

const toOpenAiAssistantMessage = (
	message: z.infer<typeof AgUiAssistantMessageSchema>,
): AgentInputItem | undefined => {
	if (!message.content) {
		return undefined;
	}

	return {
		type: "message",
		id: message.id,
		role: "assistant",
		status: "completed",
		content: [
			{
				type: "output_text",
				text: message.content,
			},
		],
	} satisfies AgentInputItem;
};

const toOpenAiFunctionCallItem = (toolCall: ParsedAgUiToolCall): AgentInputItem => {
	return {
		type: "function_call",
		id: toolCall.id,
		callId: toolCall.id,
		name: toolCall.function.name,
		arguments: toolCall.function.arguments,
		status: "completed",
	} satisfies AgentInputItem;
};

const toOpenAiFunctionCallResultItem = (
	message: z.infer<typeof AgUiToolMessageSchema>,
	toolCallName: string,
): AgentInputItem => {
	return {
		type: "function_call_result",
		id: message.id,
		callId: message.toolCallId,
		name: toolCallName,
		output:
			message.error === undefined
				? message.content
				: serializeUnknown({
						error: message.error,
						content: message.content,
					}),
		status: "completed",
	} satisfies AgentInputItem;
};

const splitConversationAtLastUserMessage = (messages: unknown[]) => {
	for (let index = messages.length - 1; index >= 0; index--) {
		const parsed = AgUiUserMessageSchema.safeParse(messages.at(index));

		if (parsed.success) {
			return {
				history: messages.slice(0, index),
				currentTurn: parsed.data,
			};
		}
	}

	throw new Error("RunAgentInput.messages does not contain a user message.");
};

const toOpenAiConversationInput = (body: RunAgentInput): OpenAiConversationInput => {
	const { history, currentTurn } = splitConversationAtLastUserMessage(body.messages);
	const toolCallNames = new Map<string, string>();
	const initialHistory: AgentInputItem[] = [];

	for (const message of history) {
		const userMessage = AgUiUserMessageSchema.safeParse(message);

		if (userMessage.success) {
			initialHistory.push(toOpenAiUserMessage(userMessage.data));
			continue;
		}

		const assistantMessage = AgUiAssistantMessageSchema.safeParse(message);

		if (assistantMessage.success) {
			const assistantItem = toOpenAiAssistantMessage(assistantMessage.data);

			if (assistantItem) {
				initialHistory.push(assistantItem);
			}

			for (const toolCall of assistantMessage.data.toolCalls ?? []) {
				toolCallNames.set(toolCall.id, toolCall.function.name);
				initialHistory.push(toOpenAiFunctionCallItem(toolCall));
			}

			continue;
		}

		const systemMessage = AgUiSystemMessageSchema.safeParse(message);

		if (systemMessage.success) {
			initialHistory.push({
				id: systemMessage.data.id,
				role: "system",
				content: systemMessage.data.content,
			} satisfies AgentInputItem);
			continue;
		}

		const developerMessage = AgUiDeveloperMessageSchema.safeParse(message);

		if (developerMessage.success) {
			initialHistory.push({
				id: developerMessage.data.id,
				role: "developer",
				content: developerMessage.data.content,
			} satisfies AgentInputItem);
			continue;
		}

		const toolMessage = AgUiToolMessageSchema.safeParse(message);

		if (toolMessage.success) {
			initialHistory.push(
				toOpenAiFunctionCallResultItem(
					toolMessage.data,
					toolCallNames.get(toolMessage.data.toolCallId) ?? "unknown_tool",
				),
			);
		}
	}

	return {
		initialHistory,
		currentTurn: [
			toOpenAiUserMessage(currentTurn),
		],
	};
};

const getRawEventItemId = (rawEvent: unknown): string | undefined => {
	if (typeof rawEvent !== "object" || rawEvent === null) {
		return undefined;
	}

	const record = rawEvent as Record<string, unknown>;
	const value = record.item_id;

	return typeof value === "string" && value.length > 0 ? value : undefined;
};

const resolveToolCallId = (
	item: ParsedToolCalledItem | ParsedToolOutputItem | undefined,
): string | undefined => {
	if (!item) {
		return undefined;
	}

	return item.callId ?? item.call_id ?? item.toolCallId ?? item.id;
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

				let conversationInput: OpenAiConversationInput;

				try {
					conversationInput = toOpenAiConversationInput(body);
				} catch (error) {
					logger.warn("Invalid AG-UI message history", {
						userId: user.id,
						error,
					});

					return Response.json(
						{
							error:
								error instanceof Error
									? error.message
									: "Invalid AG-UI message history",
						},
						{
							status: 400,
						},
					);
				}

				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					void dateContext;

					const runner = getRunner();
					const initialHistoryLength = conversationInput.initialHistory.length;
					const maxSortRow = yield* Effect.promise(async () => {
						return await kysely
							.selectFrom("assistant_chat")
							.select((eb) => eb.fn.max<number>("sort").as("maxSort"))
							.where("userId", "=", user.id)
							.executeTakeFirst();
					});
					let nextSort = maxSortRow?.maxSort ?? 0;

					return yield* Effect.promise(async () => {
						const session = new MemorySession({
							sessionId: body.threadId,
							initialItems: conversationInput.initialHistory,
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
							const toolCallAliases = new Map<string, string>();

							const bindToolCallAlias = (
								alias: string | undefined,
								canonical: string,
							) => {
								if (!alias) {
									return;
								}

								toolCallAliases.set(alias, canonical);
							};

							const getCanonicalToolCallId = (
								item: ParsedToolCalledItem | ParsedToolOutputItem | undefined,
							) => {
								const direct = resolveToolCallId(item);

								if (!direct) {
									return undefined;
								}

								return toolCallAliases.get(direct) ?? direct;
							};

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

							const startReasoningIfNeeded = (rawEvent: unknown) => {
								if (reasoningMessageId) {
									return [] as AGUIEvent[];
								}

								reasoningMessageId = getRawEventItemId(rawEvent) ?? genId();

								return [
									emit({
										type: EventType.REASONING_START,
										messageId: reasoningMessageId,
										rawEvent,
									}),
									emit({
										type: EventType.REASONING_MESSAGE_START,
										messageId: reasoningMessageId,
										role: "reasoning",
										rawEvent,
									}),
								];
							};

							const startTextIfNeeded = (rawEvent: unknown) => {
								if (textMessageId) {
									return [] as AGUIEvent[];
								}

								textMessageId = getRawEventItemId(rawEvent) ?? genId();

								return [
									emit({
										type: EventType.TEXT_MESSAGE_START,
										messageId: textMessageId,
										role: "assistant",
										rawEvent,
									}),
								];
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

								const stream = await runner.run(
									CoreAgent,
									conversationInput.currentTurn,
									{
										session,
										sessionInputCallback: (history, newItems) => [
											...history,
											...newItems,
										],
										stream: true,
										signal: request.signal,
									},
								);

								completed = stream.completed;

								for await (const event of stream) {
									if (isOpenAIResponsesRawModelStreamEvent(event)) {
										const raw = event.data.event;

										if (
											raw.type === "response.reasoning_summary_text.delta" ||
											raw.type === "response.reasoning_text.delta"
										) {
											for (const agEvent of startReasoningIfNeeded(raw)) {
												yield agEvent;
											}

											if (raw.delta) {
												yield emit({
													type: EventType.REASONING_MESSAGE_CONTENT,
													messageId: reasoningMessageId!,
													delta: raw.delta,
													rawEvent: raw,
												});
											}

											continue;
										}

										if (
											raw.type === "response.output_text.delta" ||
											raw.type === "response.refusal.delta"
										) {
											for (const agEvent of closeReasoning()) {
												yield agEvent;
											}

											for (const agEvent of startTextIfNeeded(raw)) {
												yield agEvent;
											}

											if (raw.delta) {
												yield emit({
													type: EventType.TEXT_MESSAGE_CONTENT,
													messageId: textMessageId!,
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

												const toolCallId =
													getCanonicalToolCallId(item) ?? genId();
												bindToolCallAlias(item?.id, toolCallId);
												bindToolCallAlias(item?.callId, toolCallId);
												bindToolCallAlias(item?.call_id, toolCallId);

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
													getCanonicalToolCallId(item) ?? genId();
												bindToolCallAlias(item?.id, toolCallId);
												bindToolCallAlias(item?.callId, toolCallId);
												bindToolCallAlias(item?.call_id, toolCallId);
												bindToolCallAlias(item?.toolCallId, toolCallId);

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
														messageId: item?.id ?? genId(),
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

						const encoder = new TextEncoder();

						const responseStream = new ReadableStream<Uint8Array>({
							async start(controller) {
								try {
									for await (const event of bridge()) {
										controller.enqueue(
											encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
										);
									}

									controller.close();
								} catch (error) {
									controller.error(error);
								}
							},
						});

						return new Response(responseStream, {
							headers: {
								"Content-Type": "text/event-stream; charset=utf-8",
								"Cache-Control": "no-cache, no-transform",
								Connection: "keep-alive",
								"X-Accel-Buffering": "no",
							},
						});
					});
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
