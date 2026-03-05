import { OpenAPIHono, z } from "@hono/zod-openapi";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { withMcpAuth } from "better-auth/plugins";
import { Effect } from "effect";
import { type McpOpenAPITool, OpenAPIToolGenerator, type ParameterMapper } from "mcp-from-openapi";
import type { withBuyerHono } from "~/@buyer/withBuyerHono";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

type ToolArgs = Record<string, unknown>;
type JsonRecord = Record<string, unknown>;

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

const isJsonRecord = (value: unknown): value is JsonRecord => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
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

export const withMcpApiFx = Effect.fn("withMcpApiFx")(function* () {
	const { root, buyerHono } = yield* RoutesContextFx;
	const { dialect } = yield* KyselyContextFx;
	const authApi = auth(() => dialect);

	let cache: null | {
		document: ReturnType<typeof withBuyerOpenApiDocument>;
		tools: McpOpenAPITool[];
	} = null;

	const fetchMcpState = async () => {
		if (cache) {
			return cache;
		}

		const document = withBuyerOpenApiDocument(buyerHono);
		const tools = await withMcpTools(document);
		cache = {
			document,
			tools,
		};
		return cache;
	};

	const handle = async (request: Request, accessToken: string) => {
		const { document, tools } = await fetchMcpState();
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

			server.registerTool(
				namespacedToolName,
				{
					description: tool.description,
					inputSchema: z.object({}).catchall(z.unknown()),
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

					const response = await root.fetch(
						new Request(`http://internal${mapped.path}`, {
							method: tool.metadata.method.toUpperCase(),
							headers,
							body: mapped.body ? JSON.stringify(mapped.body) : undefined,
						}),
					);

					return withToolResponse(response);
				},
			);
		}

		const transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			sessionIdGenerator: undefined,
		});
		await server.connect(transport);

		return transport.handleRequest(request);
	};

	const withHandler = withMcpAuth(authApi, async (request, session) => {
		return handle(request, session.accessToken);
	});

	root.all("/api/public/mcp", async (c) => {
		return withHandler(c.req.raw);
	});

	root.all("/api/public/mcp/*", async (c) => {
		return withHandler(c.req.raw);
	});
});
