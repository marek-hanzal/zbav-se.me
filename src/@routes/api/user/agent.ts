import { createFileRoute } from "@tanstack/react-router";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { CoreAgent } from "~/user/agent/CoreAgent";
import { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { withRunnerSessionMiddleware } from "~/user/agent/server/middleware/withRunnerSessionMiddleware";
import { AssistantRequestSchema } from "~/user/assistant/schema/AssistantRequestSchema";

const encoder = new TextEncoder();

export const Route = createFileRoute("/api/user/agent")({
	server: {
		middleware: [
			withUserMiddleware,
			withRunnerSessionMiddleware,
			withRunnerMiddleware,
		],
		handlers: {
			async POST({ request, context: { user, rootLogger, runner, session } }) {
				const logger = rootLogger.getChild("/api/user/agent");

				const input = AssistantRequestSchema.safeParse(await request.json());

				if (!input.success) {
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

				return new Response(
					new ReadableStream<Uint8Array<ArrayBuffer>>({
						async start(controller) {
							try {
								const stream = await runner.run(CoreAgent, input.data, {
									session,
									stream: true,
									signal: request.signal,
								});

								try {
									for await (const event of stream) {
										controller.enqueue(
											encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
										);
									}

									await stream.completed;

									controller.close();
								} catch (error) {
									try {
										await stream.completed;
									} catch (error) {
										logger.error("Agent stream completion failed", {
											userId: user.id,
											error: error,
										});
									}

									throw error;
								}
							} catch (error) {
								logger.error("Agent stream failed", {
									userId: user.id,
									error,
								});

								controller.close();
							}
						},
						async cancel() {
							// request.signal should already propagate disconnect/abort
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
