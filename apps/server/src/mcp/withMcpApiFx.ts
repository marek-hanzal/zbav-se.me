import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { withMcpAuth } from "better-auth/plugins";
import { Effect } from "effect";
import { match } from "ts-pattern";
import { toJSONSchema, type z } from "zod";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { toolListingCollection } from "~/mcp/buyer/toolListingCollection";
import { toolListingFetch } from "~/mcp/buyer/toolListingFetch";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";

type JsonPrimitive = boolean | null | number | string;
type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| {
			[key: string]: JsonValue;
	  };
type JsonRecord = Record<string, JsonValue>;
type JsonSchema = {
	description?: string;
	properties?: Record<string, JsonSchema>;
	required?: string[];
	type?: string | string[];
	[key: string]: unknown;
};
type McpSession = {
	accessToken: string;
	clientId: string;
	scopes: string;
	userId: string;
};
type RunnableEffect<T> = Effect.Effect<T, unknown, never>;

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

interface ToolSuccessResult {
	[key: string]: unknown;
	content: [
		{
			text: string;
			type: "text";
		},
	];
	structuredContent: Record<string, unknown>;
}

interface ResourceEntry {
	annotations: ToolAnnotations;
	argumentSummary: {
		description?: string;
		name: string;
		required: boolean;
		type: string;
	}[];
	description: string;
	examples: McpToolDefinition.Example<JsonRecord>[];
	inputSchema: JsonSchema;
	name: string;
	namespace: string;
	outputSchema: JsonSchema;
	title: string;
}

const SERVER_INFO = {
	name: "zbav-se.me MCP",
	version: "0.2.0",
} as const;

const mcpTools = [
	toolListingFetch,
	toolListingCollection,
] as const satisfies readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];

const isJsonRecord = (value: unknown): value is JsonRecord => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const withMcpCompatibleRequest = (request: Request): Request => {
	const accept = request.headers.get("Accept") ?? "";
	const hasJson = accept.includes("application/json");
	const hasEventStream = accept.includes("text/event-stream");

	if (hasJson && hasEventStream) {
		return request;
	}

	const headers = new Headers(request.headers);
	headers.set("Accept", "application/json, text/event-stream");

	return new Request(request, {
		headers,
	});
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
		if (!isJsonRecord(requestBody)) {
			return {
				requestBody,
			};
		}

		const params = isJsonRecord(requestBody.params) ? requestBody.params : undefined;

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
			if (!isJsonRecord(responseBody)) {
				return {
					responseBody,
				};
			}

			const error = isJsonRecord(responseBody.error) ? responseBody.error : undefined;

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

const withResourceContent = (uri: URL, value: unknown) => {
	return {
		contents: [
			{
				uri: uri.toString(),
				mimeType: "application/json",
				text: JSON.stringify(value),
			},
		],
	};
};

const withJsonSchema = (schema: z.ZodType, io: "input" | "output"): JsonSchema => {
	return toJSONSchema(schema, {
		io,
		unrepresentable: "any",
	}) as JsonSchema;
};

const withArgumentSummary = (schema: JsonSchema): ResourceEntry["argumentSummary"] => {
	if (schema.type !== "object" || !schema.properties) {
		return [];
	}

	const required = Array.isArray(schema.required) ? schema.required : [];

	return Object.entries(schema.properties).map(([name, value]) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) {
			return {
				name,
				required: required.includes(name),
				type: "unknown",
			};
		}

		const propertySchema = value as {
			description?: string;
			type?: string | string[];
		};
		const type = Array.isArray(propertySchema.type)
			? propertySchema.type.join(" | ")
			: (propertySchema.type ?? "unknown");

		return {
			name,
			required: required.includes(name),
			type,
			description: propertySchema.description,
		};
	});
};

const withResourceEntry = (
	tool: McpToolDefinition.Definition<z.ZodType, z.ZodType>,
): ResourceEntry => {
	const inputSchema = withJsonSchema(tool.inputSchema, "input");
	const outputSchema = withJsonSchema(tool.outputSchema, "output");

	return {
		name: `${tool.namespace}.${tool.name}`,
		namespace: tool.namespace,
		title: tool.title,
		description: tool.description,
		annotations: tool.annotations,
		inputSchema,
		outputSchema,
		argumentSummary: withArgumentSummary(inputSchema),
		examples: tool.examples as McpToolDefinition.Example<JsonRecord>[],
	};
};

const withStructuredContent = (value: unknown): Record<string, unknown> => {
	if (Array.isArray(value)) {
		return {
			items: value,
		};
	}

	if (isJsonRecord(value)) {
		return value;
	}

	return {
		value,
	};
};

const withSuccessResult = (value: unknown): ToolSuccessResult => {
	const text = JSON.stringify(value, null, 2);

	return {
		content: [
			{
				type: "text",
				text,
			},
		],
		structuredContent: withStructuredContent(value),
	};
};

const withRunnableEffect = <T>(effect: Effect.Effect<T, unknown, any>): RunnableEffect<T> => {
	return effect as RunnableEffect<T>;
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
		const resourceEntries = mcpTools.map(withResourceEntry);

		server.registerResource(
			"mcp-health",
			"zbav://mcp/health",
			{
				title: "MCP Health",
				description: "Runtime status for the zbav-se.me MCP server.",
				mimeType: "application/json",
			},
			async (uri) =>
				withResourceContent(uri, {
					name: SERVER_INFO.name,
					version: SERVER_INFO.version,
					timestamp: new Date().toISOString(),
					toolCount: mcpTools.length,
					toolNames: mcpTools.map((tool) => `${tool.namespace}.${tool.name}`),
				}),
		);

		server.registerResource(
			"mcp-tools",
			"zbav://mcp/tools",
			{
				title: "MCP Tools",
				description:
					"Model-facing catalog of manually registered MCP tools, including annotations, schema summaries, and examples.",
				mimeType: "application/json",
			},
			async (uri) => withResourceContent(uri, resourceEntries),
		);

		server.registerTool(
			`${toolListingFetch.namespace}.${toolListingFetch.name}`,
			{
				title: toolListingFetch.title,
				description: toolListingFetch.description,
				inputSchema: toolListingFetch.inputSchema,
				annotations: toolListingFetch.annotations,
				_meta: {
					examples: toolListingFetch.examples,
					namespace: toolListingFetch.namespace,
					outputSchema: withJsonSchema(toolListingFetch.outputSchema, "output"),
				},
			},
			async (args: z.output<typeof toolListingFetch.inputSchema>) => {
				const toolName = `${toolListingFetch.namespace}.${toolListingFetch.name}`;

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
					const result = await Effect.runPromise(
						withRunnableEffect(
							toolListingFetch
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
								),
						),
					);

					await withMcpLog({
						message: "mcp.tool.result",
						traceId,
						values: {
							toolName,
							ok: true,
						},
					});

					return withSuccessResult(result);
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

					return {
						content: [
							{
								type: "text" as const,
								text:
									error instanceof Error
										? error.message
										: "The MCP tool failed to execute.",
							},
						],
						isError: true,
					};
				}
			},
		);

		server.registerTool(
			`${toolListingCollection.namespace}.${toolListingCollection.name}`,
			{
				title: toolListingCollection.title,
				description: toolListingCollection.description,
				inputSchema: toolListingCollection.inputSchema,
				annotations: toolListingCollection.annotations,
				_meta: {
					examples: toolListingCollection.examples,
					namespace: toolListingCollection.namespace,
					outputSchema: withJsonSchema(toolListingCollection.outputSchema, "output"),
				},
			},
			async (args: z.output<typeof toolListingCollection.inputSchema>) => {
				const toolName = `${toolListingCollection.namespace}.${toolListingCollection.name}`;

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
					const result = await Effect.runPromise(
						withRunnableEffect(
							toolListingCollection
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
								),
						),
					);

					await withMcpLog({
						message: "mcp.tool.result",
						traceId,
						values: {
							toolName,
							ok: true,
						},
					});

					return withSuccessResult(result);
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

					return {
						content: [
							{
								type: "text" as const,
								text:
									error instanceof Error
										? error.message
										: "The MCP tool failed to execute.",
							},
						],
						isError: true,
					};
				}
			},
		);

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
	});

	root.all("/api/mcp/*", async (c) => {
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
	});
});
