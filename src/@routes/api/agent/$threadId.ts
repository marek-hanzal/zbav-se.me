import type { AgentInputItem, RunStreamEvent } from "@openai/agents";
import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { z } from "zod";
import { withDateServiceFx } from "@/lib/common/date";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withLocaleMiddleware } from "~/server/middleware/withLocaleMiddleware";
import { AssistantAgent } from "~/user/agent/AssistantAgent";
import { agentThreadFetchFx } from "~/user/agent/server/fx/agentThreadFetchFx";
import { agentUsageCreateFx } from "~/user/agent/server/fx/agentUsageCreateFx";
import { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { KyselySession } from "~/user/agent/server/session/KyselySession";
import { withUserRestrictionMiddleware } from "~/user/restriction/middleware/withUserRestrictionMiddleware";

const AgentRequestSchema: z.ZodType<AgentInputItem[]> = z
	.array(z.unknown())
	.transform((items) => items as AgentInputItem[])
	.meta({
		id: "AgentRequest",
		description: "Request body accepted by the assistant streaming endpoint",
	});

const encoder = new TextEncoder();
const keepAliveIntervalMs = 15_000;

type StreamState = {
	closed: boolean;
	heartbeat: ReturnType<typeof setInterval> | undefined;
};

type UsageSnapshot = {
	requests: number;
	input: number;
	output: number;
	total: number;
};

const emptyUsageSnapshot = (): UsageSnapshot => ({
	requests: 0,
	input: 0,
	output: 0,
	total: 0,
});

const hasUsage = ({ requests, input, output, total }: UsageSnapshot) => {
	return requests > 0 || input > 0 || output > 0 || total > 0;
};

const isUsageReadyEvent = (event: RunStreamEvent) => {
	/**
	 * The Agents SDK exposes exact token usage only when a model response stream
	 * emits `response_done`. In multi-step agent runs this can happen multiple times
	 * before the whole run finishes, so it is the earliest precise billing point.
	 */
	return event.type === "raw_model_stream_event" && event.data.type === "response_done";
};

export const Route = createFileRoute("/api/agent/$threadId")({
	server: {
		middleware: [
			withUserRestrictionMiddleware,
			withRunnerMiddleware,
			withLocaleMiddleware,
		],
		handlers: {
			async POST({
				request,
				context: { database, user, rootLogger, runner, locale, restriction },
				params: { threadId },
			}) {
				const logger = rootLogger.getChild([
					"api",
					"agent",
				]);

				const input = AgentRequestSchema.safeParse(await request.json());
				const viteEnv = ViteEnvSchema.parse(process.env);

				if (!input.success) {
					logger.warn("Invalid request (schema validation failed)", {
						issues: input.error.issues,
					});

					return Response.json(
						{
							error: "Invalid request body",
							issues: input.error.issues,
						},
						{
							status: 400,
						},
					);
				}

				try {
					/**
					 * The fetch itself here is a gate for valid thread.
					 */
					await Effect.gen(function* () {
						return yield* agentThreadFetchFx({
							where: {
								id: threadId,
							},
							scope: {
								userId: user.id,
							},
						});
					}).pipe(withKyselyFx(database), withLoggerFx(rootLogger), Effect.runPromise);
				} catch (error) {
					logger.error("Invalid request (thread not found)", {
						userId: user.id,
						threadId,
						error,
					});

					return Response.json(
						{
							error: "Thread not found",
						},
						{
							status: 404,
						},
					);
				}

				const session = new KyselySession({
					kysely: database.kysely,
					userId: user.id,
					threadId,
				});

				const abortController = new AbortController();
				const abortRunner = () => {
					if (!abortController.signal.aborted) {
						abortController.abort();
					}
				};

				return new Response(
					new ReadableStream<Uint8Array>({
						async start(controller) {
							const state: StreamState = {
								closed: false,
								heartbeat: undefined,
							};
							const abortListener = () => {
								if (request.signal.aborted) {
									abortRunner();
								}
							};

							logger.trace("Stream started");

							/**
							 * Tie the browser request abort to the agent run abort. Without this,
							 * a closed SSE connection could leave the model request running until
							 * the provider or runtime times it out.
							 */
							request.signal.addEventListener("abort", abortListener, {
								once: true,
							});
							abortListener();

							try {
								controller.enqueue(encoder.encode(": connected\n\n"));
							} catch {
								state.closed = true;
							}

							if (!state.closed) {
								/**
								 * Keep the SSE connection warm across proxies and browsers. The
								 * comment frame is ignored by EventSource-style parsers but prevents
								 * idle connection cleanup while the model is thinking or tools run.
								 */
								state.heartbeat = setInterval(() => {
									if (state.closed) {
										return;
									}

									try {
										controller.enqueue(encoder.encode(": keep-alive\n\n"));
									} catch {
										state.closed = true;
										if (state.heartbeat !== undefined) {
											clearInterval(state.heartbeat);
											state.heartbeat = undefined;
										}
									}
								}, keepAliveIntervalMs);
							}

							try {
								logger.trace("Starting run");
								const stream = await runner.run<
									AssistantAgent,
									withRunnerMiddleware.Context
								>(AssistantAgent, input.data, {
									context: {
										locale,
										cdn: viteEnv.VITE_CONTENT_CDN,
										restriction,
									},
									session,
									stream: true,
									signal: abortController.signal,
									maxTurns: 32,
								});

								logger.trace("Run created");

								let persistedUsage = emptyUsageSnapshot();

								const flushUsage = async () => {
									/**
									 * `stream.state.usage` is cumulative for the whole run. Persist only
									 * the delta since the last successful write, otherwise every
									 * `response_done` would double-count earlier model requests.
									 */
									const currentUsage = {
										requests: stream.state.usage.requests,
										input: stream.state.usage.inputTokens,
										total: stream.state.usage.totalTokens,
										output: stream.state.usage.outputTokens,
									} satisfies UsageSnapshot;

									const usage = {
										requests: currentUsage.requests - persistedUsage.requests,
										input: currentUsage.input - persistedUsage.input,
										total: currentUsage.total - persistedUsage.total,
										output: currentUsage.output - persistedUsage.output,
									} satisfies UsageSnapshot;

									if (!hasUsage(usage)) {
										return;
									}

									try {
										await Effect.gen(function* () {
											yield* agentUsageCreateFx({
												userId: user.id,
												threadId,
												...usage,
											});
										}).pipe(
											withKyselyFx(database),
											withDateServiceFx(),
											withLoggerFx(rootLogger),
											Effect.runPromise,
										);

										persistedUsage = currentUsage;
									} catch (error) {
										logger.error("Agent usage persistence failed", {
											userId: user.id,
											threadId,
											usage,
											error,
										});
									}
								};

								try {
									/**
									 * Forward raw agent events as SSE. Usage is flushed immediately after
									 * a usage-ready event is sent so the client still receives the event
									 * even if the accounting write is slow or fails.
									 */
									logger.trace("Starting event stream", {
										threadId,
									});

									for await (const event of stream) {
										if (state.closed) {
											break;
										}

										try {
											controller.enqueue(
												encoder.encode(
													`data: ${JSON.stringify(event as RunStreamEvent)}\n\n`,
												),
											);
										} catch {
											state.closed = true;
											break;
										}

										if (isUsageReadyEvent(event)) {
											await flushUsage();
										}
									}

									logger.trace("Stream finished, about to wait for completed", {
										threadId,
									});

									await stream.completed;

									logger.trace("Stream success", {
										threadId,
									});
								} finally {
									/**
									 * Do one final delta flush even on cancellation or stream errors.
									 * This catches any completed model request that updated SDK usage but
									 * did not pass through the regular event-loop flush path.
									 */
									await flushUsage();
								}
							} catch (error) {
								logger.error("Agent stream failed", {
									userId: user.id,
									error,
								});

								if (!state.closed && !abortController.signal.aborted) {
									try {
										controller.enqueue(
											encoder.encode(
												`data: ${JSON.stringify({
													type: "raw_model_stream_event",
													data: {
														type: "model",
														event: {
															type: "response.failed",
															response: {
																error: {
																	code: "server_error",
																	message:
																		"Model is unavailable right now. Please try again in a moment.",
																	param: null,
																},
															},
															sequence_number: 0,
														},
													},
												})}\n\n`,
											),
										);
									} catch {
										state.closed = true;
									}
								}
							} finally {
								/**
								 * Cleanup lives outside the agent-run try/catch because it must happen
								 * for validation-successful requests regardless of model, persistence,
								 * or client connection failures.
								 */
								request.signal.removeEventListener("abort", abortListener);

								clearInterval(state.heartbeat);
								state.heartbeat = undefined;

								if (!state.closed) {
									state.closed = true;
									try {
										controller.close();
									} catch {
										//
									}
								}
							}
						},
						cancel() {
							abortRunner();
						},
					}),
					{
						headers: {
							"Content-Type": "text/event-stream; charset=utf-8",
							"Cache-Control": "no-cache, no-transform",
							Connection: "keep-alive",
							"X-Accel-Buffering": "no",
						},
					},
				);
			},
		},
	},
});
