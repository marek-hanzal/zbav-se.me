import type { AgentInputItem, RunStreamEvent } from "@openai/agents";
import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLocaleMiddleware } from "~/server/middleware/withLocaleMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { AssistantAgent } from "~/user/agent/AssistantAgent";
import { agentThreadFetchFx } from "~/user/agent/server/fx/agentThreadFetchFx";
import { agentUsageCreateFx } from "~/user/agent/server/fx/agentUsageCreateFx";
import { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { KyselySession } from "~/user/agent/server/session/KyselySession";

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

export const Route = createFileRoute("/api/agent/$threadId")({
	server: {
		middleware: [
			withUserMiddleware,
			withDatabaseMiddleware,
			withRunnerMiddleware,
			withLocaleMiddleware,
		],
		handlers: {
			async POST({
				request,
				context: { database, user, rootLogger, runner, locale },
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
									},
									session,
									stream: true,
									signal: abortController.signal,
								});

								logger.trace("Run created");

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
								}

								logger.trace("Stream finished, about to wait for completed", {
									threadId,
								});

								await stream.completed;

								logger.trace("Stream success", {
									threadId,
								});

								try {
									await Effect.gen(function* () {
										yield* agentUsageCreateFx({
											userId: user.id,
											threadId,
											requests: stream.state.usage.requests,
											input: stream.state.usage.inputTokens,
											total: stream.state.usage.totalTokens,
											output: stream.state.usage.outputTokens,
										});
									}).pipe(
										withKyselyFx(database),
										withDateFx,
										withLoggerFx(rootLogger),
										Effect.runPromise,
									);
								} catch (error) {
									logger.error("Agent usage persistence failed", {
										userId: user.id,
										threadId,
										error,
									});
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
