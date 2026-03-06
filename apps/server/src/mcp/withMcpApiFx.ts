import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
	CallToolResult,
	ServerNotification,
	ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { withMcpAuth } from "better-auth/plugins";
import { Effect } from "effect";
import { match } from "ts-pattern";
import type { z } from "zod";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { withMcpResources } from "~/mcp/resource";
import { SERVER_INFO } from "~/mcp/serverInfo";
import { mcpTools } from "~/mcp/tool";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";

type McpSession = {
	accessToken: string;
	clientId: string;
	scopes: string;
	userId: string;
};
interface HandleProps {
	method: string;
	path: string;
	request: Request;
	session: McpSession;
	traceId: string;
	userAgent: string;
}

interface WithMcpLogProps {
	level?: "error" | "info" | "warning";
	message: string;
	traceId: string;
	values?: Record<string, unknown>;
}

interface McpRequestLogValues {
	hasArguments?: boolean;
	jsonRpcId?: null | number | string;
	jsonRpcMethod?: string;
	jsonRpcToolName?: string;
	requestBody?: unknown;
}

interface McpResponseLogValues {
	jsonRpcErrorCode?: number;
	jsonRpcErrorMessage?: string;
	jsonRpcId?: null | number | string;
	responseBody?: unknown;
}

const withMcpCompatibleRequest = (request: Request): Request => {
	const accept = request.headers.get("Accept") ?? "";
	const hasJson = accept.includes("application/json");
	const hasEventStream = accept.includes("text/event-stream");

	if (hasJson && hasEventStream) {
		return request;
	}

	const headers = new Headers(request.headers);
	headers.set("Accept", "application/json, text/event-stream");
	const init: RequestInit & {
		duplex?: "half";
	} = {
		method: request.method,
		headers,
	};

	if (request.method !== "GET" && request.method !== "HEAD") {
		init.body = request.body;
		init.duplex = "half";
	}

	return new Request(request.url, init);
};

const withJsonRpcId = (value: unknown): McpRequestLogValues["jsonRpcId"] => {
	if (typeof value === "string" || typeof value === "number" || value === null) {
		return value;
	}

	return undefined;
};

const withRequestLogValues = async (request: Request): Promise<McpRequestLogValues> => {
	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		return {};
	}

	try {
		const requestBody = await request.clone().json();
		if (!McpSchema.isJsonRecord(requestBody)) {
			return {
				requestBody,
			};
		}

		const params = McpSchema.isJsonRecord(requestBody.params) ? requestBody.params : undefined;

		return {
			requestBody,
			jsonRpcId: withJsonRpcId(requestBody.id),
			jsonRpcMethod: typeof requestBody.method === "string" ? requestBody.method : undefined,
			jsonRpcToolName: typeof params?.name === "string" ? params.name : undefined,
			hasArguments: params ? "arguments" in params : undefined,
		};
	} catch {
		return {};
	}
};

const withErrorResponseLogValues = async (response: Response): Promise<McpResponseLogValues> => {
	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("application/json")) {
		try {
			const responseBody = await response.clone().json();
			if (!McpSchema.isJsonRecord(responseBody)) {
				return {
					responseBody,
				};
			}

			const error = McpSchema.isJsonRecord(responseBody.error)
				? responseBody.error
				: undefined;

			return {
				responseBody,
				jsonRpcId: withJsonRpcId(responseBody.id),
				jsonRpcErrorCode: typeof error?.code === "number" ? error.code : undefined,
				jsonRpcErrorMessage: typeof error?.message === "string" ? error.message : undefined,
			};
		} catch {
			return {};
		}
	}

	try {
		return {
			responseBody: await response.clone().text(),
		};
	} catch {
		return {};
	}
};

const withStructuredContent = (value: unknown): Record<string, unknown> => {
	if (Array.isArray(value)) {
		return {
			items: value,
		};
	}

	if (McpSchema.isJsonRecord(value)) {
		return value;
	}

	return {
		value,
	};
};

const withSuccessText = ({
	schemaResourceUri,
	toolTitle,
	value,
}: {
	schemaResourceUri: string;
	toolTitle: string;
	value: unknown;
}): string => {
	if (Array.isArray(value)) {
		return `Returned ${value.length} item(s) from ${toolTitle}. Use structuredContent.items for machine-readable data. Output schema: ${schemaResourceUri}.`;
	}

	if (McpSchema.isJsonRecord(value)) {
		return `Returned one result from ${toolTitle}. Use structuredContent for machine-readable fields. Output schema: ${schemaResourceUri}.`;
	}

	return `Returned a result from ${toolTitle}. Output schema: ${schemaResourceUri}.`;
};

const withSuccessResult = ({
	schemaResourceUri,
	toolTitle,
	value,
}: {
	schemaResourceUri: string;
	toolTitle: string;
	value: unknown;
}): CallToolResult => {
	const text = JSON.stringify(value, null, 2);

	return {
		content: [
			{
				type: "text",
				text: `${withSuccessText({
					schemaResourceUri,
					toolTitle,
					value,
				})}\n\n${text}`,
			},
		],
		structuredContent: withStructuredContent(value),
	};
};

const withErrorResult = (error: unknown): CallToolResult => {
	return {
		content: [
			{
				type: "text",
				text: error instanceof Error ? error.message : "The MCP tool failed to execute.",
			},
		],
		isError: true,
	};
};

const withSerializedError = (error: unknown) => {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack,
			cause: error.cause,
		};
	}

	return {
		error,
	};
};

export const withMcpApiFx = Effect.fn("withMcpApiFx")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;
	const { dialect } = kysely;
	const axiomConfig = ServerAxiomSchema.parse(process.env);
	const authApi = auth(() => dialect, {
		basePath: "/api/oauth",
	});

	const withMcpLog = async ({
		level = "info",
		message,
		traceId,
		values = {},
	}: WithMcpLogProps) => {
		const logFx = match(level)
			.with("warning", () => Effect.logWarning(message))
			.with("error", () => Effect.logError(message))
			.otherwise(() => Effect.log(message));

		await logFx
			.pipe(
				Effect.annotateLogs(values),
				withLoggingFx(axiomConfig, "mcp", traceId),
				Effect.runPromise,
			)
			.catch(() => undefined);
	};

	const handle = async ({ method, path, request, session, traceId, userAgent }: HandleProps) => {
		const requestValues = await withRequestLogValues(request);

		await withMcpLog({
			message: "mcp.request.start",
			traceId,
			values: {
				method,
				path,
				userAgent,
				clientId: session.clientId,
				userId: session.userId,
				...requestValues,
			},
		});

		const server = new McpServer(SERVER_INFO);
		for (const resource of withMcpResources({
			serverInfo: SERVER_INFO,
		})) {
			server.registerResource(
				resource.name,
				resource.uri,
				{
					title: resource.title,
					description: resource.description,
					mimeType: resource.mimeType,
				},
				resource.read,
			);
		}

		const registerTool = <TInputSchema extends z.ZodType, TOutputSchema extends z.ZodType>(
			tool: McpToolDefinition.Definition<TInputSchema, TOutputSchema>,
		) => {
			const toolName = `${tool.namespace}.${tool.name}`;
			const handleTool = (async (
				args: z.output<TInputSchema>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			): Promise<CallToolResult> => {
				await withMcpLog({
					message: "mcp.tool.invoke",
					traceId,
					values: {
						toolName,
						userId: session.userId,
						arguments: args,
					},
				});

				try {
					const effect = tool
						.execute(args, {
							userId: session.userId,
							traceId,
						})
						.pipe(
							withKyselyFx(kysely),
							withLoggingFx(axiomConfig, "mcp", traceId),
							Effect.annotateLogs({
								toolName,
								userId: session.userId,
							}),
						) as Effect.Effect<unknown, unknown, never>;
					const result = await Effect.runPromise(effect);

					await withMcpLog({
						message: "mcp.tool.result",
						traceId,
						values: {
							toolName,
							ok: true,
						},
					});

					return withSuccessResult({
						value: result,
						toolTitle: tool.title,
						schemaResourceUri: McpSchema.withSchemaResourceUri(toolName),
					});
				} catch (error) {
					await withMcpLog({
						level: "error",
						message: "mcp.tool.error",
						traceId,
						values: {
							toolName,
							ok: false,
							arguments: args,
							error: withSerializedError(error),
						},
					});

					return withErrorResult(error);
				}
			}) as never;

			server.registerTool(
				toolName,
				{
					title: tool.title,
					description: tool.description,
					inputSchema: tool.inputSchema,
					annotations: tool.annotations,
					_meta: {
						examples: tool.examples,
						namespace: tool.namespace,
						role: tool.role,
						workflowHint: tool.workflowHint,
						guideResourceUris: tool.guideResourceUris,
						entityResourceUris: tool.entityResourceUris,
						fieldResourceUris: tool.fieldResourceUris,
						inputSchema: McpSchema.withJsonSchema(tool.inputSchema, "input"),
						outputSchema: McpSchema.withJsonSchema(tool.outputSchema, "output"),
					},
				},
				handleTool,
			);
		};

		const [toolListingFetch, toolListingCollection] = mcpTools;

		registerTool(toolListingFetch);
		registerTool(toolListingCollection);

		const transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			sessionIdGenerator: undefined,
		});

		await server.connect(transport);

		try {
			const response = await transport.handleRequest(request);

			if (response.ok) {
				await withMcpLog({
					message: "mcp.request.result",
					traceId,
					values: {
						method,
						path,
						status: response.status,
						ok: true,
						jsonRpcId: requestValues.jsonRpcId,
						jsonRpcMethod: requestValues.jsonRpcMethod,
						jsonRpcToolName: requestValues.jsonRpcToolName,
					},
				});
			} else {
				await withMcpLog({
					level: "warning",
					message: "mcp.request.failed",
					traceId,
					values: {
						method,
						path,
						status: response.status,
						ok: false,
						jsonRpcMethod: requestValues.jsonRpcMethod,
						jsonRpcToolName: requestValues.jsonRpcToolName,
						...(await withErrorResponseLogValues(response)),
					},
				});
			}

			return response;
		} catch (error) {
			await withMcpLog({
				level: "error",
				message: "mcp.request.error",
				traceId,
				values: {
					method,
					path,
					jsonRpcMethod: requestValues.jsonRpcMethod,
					jsonRpcToolName: requestValues.jsonRpcToolName,
					error: withSerializedError(error),
				},
			});

			throw error;
		}
	};

	const withHandler = (method: string, path: string, traceId: string, userAgent: string) =>
		withMcpAuth(authApi, async (request, session) =>
			handle({
				method,
				path,
				request: withMcpCompatibleRequest(request),
				session,
				traceId,
				userAgent,
			}),
		);

	root.all("/api/mcp", async (c) => {
		try {
			const response = await withHandler(
				c.req.method,
				c.req.path,
				c.get("traceId"),
				c.req.header("user-agent") ?? "",
			)(c.req.raw);

			if (response.status === 401) {
				await withMcpLog({
					level: "warning",
					message: "mcp.auth.unauthorized",
					traceId: c.get("traceId"),
					values: {
						method: c.req.method,
						path: c.req.path,
						userAgent: c.req.header("user-agent") ?? "",
					},
				});
			}

			return response;
		} catch (error) {
			await withMcpLog({
				level: "error",
				message: "mcp.route.error",
				traceId: c.get("traceId"),
				values: {
					method: c.req.method,
					path: c.req.path,
					userAgent: c.req.header("user-agent") ?? "",
					error: withSerializedError(error),
				},
			});
			throw error;
		}
	});

	root.all("/api/mcp/*", async (c) => {
		try {
			const response = await withHandler(
				c.req.method,
				c.req.path,
				c.get("traceId"),
				c.req.header("user-agent") ?? "",
			)(c.req.raw);

			if (response.status === 401) {
				await withMcpLog({
					level: "warning",
					message: "mcp.auth.unauthorized",
					traceId: c.get("traceId"),
					values: {
						method: c.req.method,
						path: c.req.path,
						userAgent: c.req.header("user-agent") ?? "",
					},
				});
			}

			return response;
		} catch (error) {
			await withMcpLog({
				level: "error",
				message: "mcp.route.error",
				traceId: c.get("traceId"),
				values: {
					method: c.req.method,
					path: c.req.path,
					userAgent: c.req.header("user-agent") ?? "",
					error: withSerializedError(error),
				},
			});
			throw error;
		}
	});
});
