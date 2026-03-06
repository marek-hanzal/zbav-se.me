import { OpenAPIHono, z } from "@hono/zod-openapi";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { withMcpAuth } from "better-auth/plugins";
import { Effect } from "effect";
import { type McpOpenAPITool, OpenAPIToolGenerator, type ParameterMapper } from "mcp-from-openapi";
import { match } from "ts-pattern";
import type { withBuyerHono } from "~/@buyer/withBuyerHono";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";

type ToolArgs = Record<string, unknown>;
type JsonRecord = Record<string, unknown>;
type JsonSchema = Record<string, unknown>;
type JsonSchemaInput = JsonSchema | boolean;
type ZodSchema = z.ZodTypeAny;

interface ToolRequest {
	body: JsonRecord | undefined;
	cookies: Record<string, string>;
	headers: Headers;
	path: string;
}

interface WithMappedRequestProps {
	args: ToolArgs;
	mappers: ParameterMapper[];
	path: string;
}

interface WithResourceContentProps {
	uri: URL;
	value: unknown;
}

interface WithToolNamespaceProps {
	path: string;
	tags?: string[];
}

interface WithNamespacedToolNameProps {
	name: string;
	namespace: string;
}

type McpMetaAnnotations = {
	destructiveHint?: boolean;
	idempotentHint?: boolean;
	openWorldHint?: boolean;
	readOnlyHint?: boolean;
	title?: string;
};

type McpMetaMap = Map<string, McpMetaAnnotations>;

interface WithMcpMetaKeyProps {
	method: string;
	operationId?: string;
	path: string;
}

interface WithMcpLogProps {
	level?: "error" | "info" | "warning";
	message: string;
	root: string;
	traceId: string;
	values?: Record<string, unknown>;
}

interface HandleProps {
	accessToken: string;
	method: string;
	path: string;
	request: Request;
	traceId: string;
	userAgent: string;
}

interface McpRequestLogValues {
	jsonRpcId?: string | number | null;
	jsonRpcMethod?: string;
	jsonRpcToolName?: string;
	hasArguments?: boolean;
}

interface McpResponseLogValues {
	jsonRpcErrorCode?: number;
	jsonRpcErrorMessage?: string;
	jsonRpcId?: string | number | null;
	jsonRpcResultType?: string;
}

const McpMetaAnnotationsSchema = z
	.object({
		title: z.string().optional(),
		readOnlyHint: z.boolean().optional(),
		destructiveHint: z.boolean().optional(),
		idempotentHint: z.boolean().optional(),
		openWorldHint: z.boolean().optional(),
	})
	.catch({});

const McpMetaSchema = z
	.object({
		annotations: McpMetaAnnotationsSchema.default({}),
	})
	.catch({
		annotations: {},
	});

const isJsonRecord = (value: unknown): value is JsonRecord => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isJsonSchema = (value: unknown): value is JsonSchema => {
	return isJsonRecord(value);
};

const isJsonSchemaInput = (value: unknown): value is JsonSchemaInput => {
	return typeof value === "boolean" || isJsonSchema(value);
};

const withToolInputSchema = (schema: unknown): ZodSchema => {
	if (!isJsonSchemaInput(schema)) {
		return z.object({}).catchall(z.unknown());
	}

	return z.fromJSONSchema(schema);
};

const withToolArgs = (value: unknown): ToolArgs => {
	return isJsonRecord(value) ? value : {};
};

const withValue = (value: unknown): string => {
	if (typeof value === "string") {
		return value;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return JSON.stringify(value);
};

const withCookieHeader = (cookies: Record<string, string>): string | null => {
	const entries = Object.entries(cookies);
	if (entries.length === 0) {
		return null;
	}

	return entries
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join("; ");
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

const withMappedRequest = ({ args, mappers, path }: WithMappedRequestProps) => {
	const query = new URLSearchParams();
	const headers = new Headers();
	const cookies: Record<string, string> = {};
	const body: JsonRecord = {};

	let resolvedPath = path;

	for (const mapper of mappers) {
		const input = args[mapper.inputKey];

		if (input === undefined || mapper.security) {
			continue;
		}

		switch (mapper.type) {
			case "path": {
				const encoded = encodeURIComponent(withValue(input));
				resolvedPath = resolvedPath
					.replace(`{${mapper.key}}`, encoded)
					.replace(`:${mapper.key}`, encoded);
				break;
			}
			case "query": {
				if (Array.isArray(input)) {
					for (const value of input) {
						query.append(mapper.key, withValue(value));
					}
					break;
				}
				query.append(mapper.key, withValue(input));
				break;
			}
			case "header": {
				headers.set(mapper.key, withValue(input));
				break;
			}
			case "cookie": {
				cookies[mapper.key] = withValue(input);
				break;
			}
			case "body": {
				body[mapper.key] = input;
				break;
			}
		}
	}

	const hasBody = Object.keys(body).length > 0;
	const queryString = query.toString();
	const fullPath = queryString.length > 0 ? `${resolvedPath}?${queryString}` : resolvedPath;

	return {
		body: hasBody ? body : undefined,
		cookies,
		headers,
		path: fullPath,
	} satisfies ToolRequest;
};

const withBuyerOpenApiDocument = (buyerHono: withBuyerHono) => {
	const tmp = new OpenAPIHono();
	tmp.route("/api/buyer", buyerHono);

	return tmp.getOpenAPI31Document({
		openapi: "3.1.0",
		info: {
			title: "Buyer zbav-se.me MCP bridge",
			version: "0.5.0",
		},
		security: [],
	});
};

const withMcpTools = async (document: ReturnType<typeof withBuyerOpenApiDocument>) => {
	const generator = await OpenAPIToolGenerator.fromJSON(document);

	return generator.generateTools({
		filterFn(operation) {
			return operation.tags?.includes("mcp") ?? false;
		},
		includeSecurityInInput: false,
	});
};

const withMcpMetaKey = ({ method, operationId, path }: WithMcpMetaKeyProps): string => {
	return operationId ? `operationId:${operationId}` : `${method.toUpperCase()} ${path}`;
};

const withMcpMetaAnnotations = (value: unknown): McpMetaAnnotations | undefined => {
	if (value === undefined) {
		return undefined;
	}

	return McpMetaSchema.parse(value).annotations;
};

const withMcpMetaMap = (document: ReturnType<typeof withBuyerOpenApiDocument>): McpMetaMap => {
	const map: McpMetaMap = new Map();

	for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
		if (!isJsonRecord(pathItem)) {
			continue;
		}

		for (const method of [
			"get",
			"put",
			"post",
			"delete",
			"options",
			"head",
			"patch",
			"trace",
		] as const) {
			const operation = pathItem[method];
			if (!isJsonRecord(operation)) {
				continue;
			}

			const mcpMeta = withMcpMetaAnnotations(operation["x-mcp-meta"]);
			if (!mcpMeta) {
				continue;
			}

			const operationId =
				typeof operation.operationId === "string" ? operation.operationId : undefined;
			map.set(
				withMcpMetaKey({
					method,
					operationId,
					path,
				}),
				mcpMeta,
			);
		}
	}

	return map;
};

const withResourceContent = ({ uri, value }: WithResourceContentProps) => {
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

const withSanitizedName = (value: string): string => {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-+/g, "-");
};

const withPathNamespace = (path: string): string => {
	const [, api, namespace] = path.split("/");
	if (api === "api" && namespace) {
		return withSanitizedName(namespace);
	}

	return "default";
};

const withToolNamespace = ({ path, tags }: WithToolNamespaceProps): string => {
	const firstTag = tags?.[0];
	if (firstTag) {
		const namespace = withSanitizedName(firstTag);
		if (namespace.length > 0) {
			return namespace;
		}
	}

	return withPathNamespace(path);
};

const withNamespacedToolName = ({ name, namespace }: WithNamespacedToolNameProps): string => {
	return `${namespace}.${name}`;
};

const withToolAnnotations = (tool: McpOpenAPITool, mcpMeta?: McpMetaAnnotations) => {
	const method = tool.metadata.method.toUpperCase();
	const readOnlyByMethod = method === "GET" || method === "HEAD" || method === "OPTIONS";

	if (!mcpMeta && !readOnlyByMethod) {
		return undefined;
	}

	const readOnlyHint = mcpMeta?.readOnlyHint ?? readOnlyByMethod;

	return {
		title: mcpMeta?.title,
		readOnlyHint,
		destructiveHint: mcpMeta?.destructiveHint ?? !readOnlyHint,
		idempotentHint: mcpMeta?.idempotentHint ?? readOnlyHint,
		openWorldHint: mcpMeta?.openWorldHint,
	};
};

const withToolResponse = async (response: Response) => {
	const contentType = response.headers.get("content-type") ?? "";
	const isJson = contentType.includes("application/json");

	if (!isJson) {
		const text = await response.text();
		if (!response.ok) {
			return {
				content: [
					{
						type: "text" as const,
						text: `HTTP ${response.status}: ${text}`,
					},
				],
				isError: true,
			};
		}
		return {
			content: [
				{
					type: "text" as const,
					text,
				},
			],
		};
	}

	const json = await response.json();
	const text = JSON.stringify(json);

	if (!response.ok) {
		return {
			content: [
				{
					type: "text" as const,
					text: `HTTP ${response.status}: ${text}`,
				},
			],
			isError: true,
		};
	}

	return {
		content: [
			{
				type: "text" as const,
				text,
			},
		],
	};
};

const withMcpRequestLogValues = async (request: Request): Promise<McpRequestLogValues> => {
	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		return {};
	}

	try {
		const payload = await request.clone().json();
		if (!isJsonRecord(payload)) {
			return {};
		}

		const params = isJsonRecord(payload.params) ? payload.params : undefined;

		return {
			jsonRpcId:
				typeof payload.id === "string" || typeof payload.id === "number" || payload.id === null
					? payload.id
					: undefined,
			jsonRpcMethod: typeof payload.method === "string" ? payload.method : undefined,
			jsonRpcToolName: typeof params?.name === "string" ? params.name : undefined,
			hasArguments: params ? "arguments" in params : undefined,
		};
	} catch {
		return {};
	}
};

const withMcpResponseLogValues = async (response: Response): Promise<McpResponseLogValues> => {
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) {
		return {};
	}

	try {
		const payload = await response.clone().json();
		if (!isJsonRecord(payload)) {
			return {};
		}

		const error = isJsonRecord(payload.error) ? payload.error : undefined;
		const result = payload.result;

		return {
			jsonRpcId:
				typeof payload.id === "string" || typeof payload.id === "number" || payload.id === null
					? payload.id
					: undefined,
			jsonRpcErrorCode: typeof error?.code === "number" ? error.code : undefined,
			jsonRpcErrorMessage: typeof error?.message === "string" ? error.message : undefined,
			jsonRpcResultType:
				result === undefined || result === null
					? undefined
					: Array.isArray(result)
						? "array"
						: typeof result,
		};
	} catch {
		return {};
	}
};

export const withMcpApiFx = Effect.fn("withMcpApiFx")(function* () {
	const { root, buyerHono } = yield* RoutesContextFx;
	const { dialect } = yield* KyselyContextFx;
	const axiomConfig = ServerAxiomSchema.parse(process.env);
	const authApi = auth(() => dialect);
	const withMcpLog = async ({
		level = "info",
		message,
		root: logRoot,
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
				withLoggingFx(axiomConfig, logRoot, traceId),
				Effect.runPromise,
			)
			.catch(() => undefined);
	};

	let cache: null | {
		document: ReturnType<typeof withBuyerOpenApiDocument>;
		mcpMetaMap: McpMetaMap;
		tools: McpOpenAPITool[];
	} = null;

	const fetchMcpState = async () => {
		if (cache) {
			return cache;
		}

		const document = withBuyerOpenApiDocument(buyerHono);
		const tools = await withMcpTools(document);
		const mcpMetaMap = withMcpMetaMap(document);
		cache = {
			document,
			mcpMetaMap,
			tools,
		};
		return cache;
	};

	const handle = async ({
		accessToken,
		method,
		path,
		request,
		traceId,
		userAgent,
	}: HandleProps) => {
		const requestValues = await withMcpRequestLogValues(request);

		await withMcpLog({
			message: "mcp.request.start",
			root: "mcp",
			traceId,
			values: {
				method,
				path,
				userAgent,
				...requestValues,
			},
		});

		const { document, mcpMetaMap, tools } = await fetchMcpState();
		const server = new McpServer({
			name: "zbav-se-buyer-listing-mcp",
			version: "0.1.0",
		});

		server.registerResource(
			"mcp-health",
			"zbav://mcp/health",
			{
				title: "MCP Health",
				description: "Runtime state and MCP server metadata",
				mimeType: "application/json",
			},
			async (uri) => {
				return withResourceContent({
					uri,
					value: {
						name: "zbav-se-buyer-listing-mcp",
						version: "0.1.0",
						toolCount: tools.length,
						timestamp: new Date().toISOString(),
					},
				});
			},
		);

		server.registerResource(
			"mcp-tools",
			"zbav://mcp/tools",
			{
				title: "MCP Tools",
				description: "Exported MCP tools and their API operation mapping",
				mimeType: "application/json",
			},
			async (uri) => {
				return withResourceContent({
					uri,
					value: tools.map((tool) => {
						const namespace = withToolNamespace({
							path: tool.metadata.path,
							tags: tool.metadata.tags,
						});

						return {
							name: withNamespacedToolName({
								name: tool.name,
								namespace,
							}),
							namespace,
							originalName: tool.name,
							description: tool.description,
							method: tool.metadata.method.toUpperCase(),
							path: tool.metadata.path,
							tags: tool.metadata.tags ?? [],
						};
					}),
				});
			},
		);

		server.registerResource(
			"mcp-openapi",
			"zbav://mcp/openapi",
			{
				title: "MCP OpenAPI",
				description: "OpenAPI snapshot used for MCP tool generation",
				mimeType: "application/json",
			},
			async (uri) => {
				return withResourceContent({
					uri,
					value: document,
				});
			},
		);

		for (const tool of tools) {
			const namespace = withToolNamespace({
				path: tool.metadata.path,
				tags: tool.metadata.tags,
			});
			const namespacedToolName = withNamespacedToolName({
				name: tool.name,
				namespace,
			});
			const mcpMeta = mcpMetaMap.get(
				withMcpMetaKey({
					method: tool.metadata.method.toUpperCase(),
					operationId: tool.metadata.operationId,
					path: tool.metadata.path,
				}),
			);

			server.registerTool(
				namespacedToolName,
				{
					description: tool.description,
					inputSchema: withToolInputSchema(tool.inputSchema),
					annotations: withToolAnnotations(tool, mcpMeta),
				},
				async (rawArgs: unknown) => {
					const args = withToolArgs(rawArgs);
					const mapped = withMappedRequest({
						args,
						mappers: tool.mapper,
						path: tool.metadata.path,
					});

					const headers = new Headers(mapped.headers);
					headers.set("Accept", "application/json");
					headers.set("Authorization", `Bearer ${accessToken}`);

					const cookie = withCookieHeader(mapped.cookies);
					if (cookie) {
						headers.set("Cookie", cookie);
					}

					if (mapped.body) {
						headers.set("Content-Type", "application/json");
					}

					await withMcpLog({
						message: "mcp.tool.invoke",
						root: "mcp",
						traceId,
						values: {
							toolName: namespacedToolName,
							method: tool.metadata.method.toUpperCase(),
							path: mapped.path,
						},
					});

					try {
						const response = await root.fetch(
							new Request(`http://internal${mapped.path}`, {
								method: tool.metadata.method.toUpperCase(),
								headers,
								body: mapped.body ? JSON.stringify(mapped.body) : undefined,
							}),
						);

						await withMcpLog({
							message: "mcp.tool.result",
							root: "mcp",
							traceId,
							values: {
								toolName: namespacedToolName,
								ok: response.ok,
								status: response.status,
							},
						});

						return withToolResponse(response);
					} catch (error) {
						await withMcpLog({
							level: "error",
							message: "mcp.tool.error",
							root: "mcp",
							traceId,
							values: {
								toolName: namespacedToolName,
								error: error instanceof Error ? error.message : "unknown-error",
							},
						});

						throw error;
					}
				},
			);
		}

		const transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			sessionIdGenerator: undefined,
		});
		await server.connect(transport);
		const response = await transport.handleRequest(request);
		const responseValues = await withMcpResponseLogValues(response);

		await withMcpLog({
			level: response.ok ? "info" : "warning",
			message: response.ok ? "mcp.request.result" : "mcp.request.failed",
			root: "mcp",
			traceId,
			values: {
				method,
				path,
				status: response.status,
				ok: response.ok,
				...responseValues,
			},
		});

		return response;
	};

	root.all("/api/mcp", async (c) => {
		const withHandler = withMcpAuth(authApi, async (request, session) => {
			return handle({
				accessToken: session.accessToken,
				method: c.req.method,
				path: c.req.path,
				request: withMcpCompatibleRequest(request),
				traceId: c.get("traceId"),
				userAgent: c.req.header("user-agent") ?? "",
			});
		});

		const response = await withHandler(c.req.raw);
		if (response.status === 401) {
			await withMcpLog({
				level: "warning",
				message: "mcp.auth.unauthorized",
				root: "mcp",
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
		const withHandler = withMcpAuth(authApi, async (request, session) => {
			return handle({
				accessToken: session.accessToken,
				method: c.req.method,
				path: c.req.path,
				request: withMcpCompatibleRequest(request),
				traceId: c.get("traceId"),
				userAgent: c.req.header("user-agent") ?? "",
			});
		});

		const response = await withHandler(c.req.raw);
		if (response.status === 401) {
			await withMcpLog({
				level: "warning",
				message: "mcp.auth.unauthorized",
				root: "mcp",
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
