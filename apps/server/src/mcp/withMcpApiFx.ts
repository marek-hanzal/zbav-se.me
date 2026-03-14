import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
	CallToolResult,
	ServerNotification,
	ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { withMcpAuth } from "better-auth/plugins";
import { Effect } from "effect";
import type { z } from "zod";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { withMcpResources } from "~/mcp/resource";
import { SERVER_INFO } from "~/mcp/serverInfo";
import { mcpTools } from "~/mcp/tool";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

type McpSession = {
	accessToken: string;
	clientId: string;
	scopes: string;
	userId: string;
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

export const withMcpApiFx = Effect.fn("withMcpApiFx")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;
	const { dialect } = kysely;
	const authApi = auth(() => dialect, {
		basePath: "/api/oauth",
	});

	const handle = async ({ request, session }: { request: Request; session: McpSession }) => {
		const server = new McpServer(SERVER_INFO);
		const { resources, templates } = withMcpResources({
			serverInfo: SERVER_INFO,
		});
		for (const resource of resources) {
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
		for (const template of templates) {
			server.registerResource(
				template.name,
				new ResourceTemplate(template.uriTemplate, {
					list: () => template.list(),
					complete: template.complete,
				}),
				{
					title: template.title,
					description: template.description,
					mimeType: template.mimeType,
				},
				(uri, variables) => template.read(uri, variables),
			);
		}

		const registerTool = (tool: McpToolDefinition.Definition<z.ZodType, z.ZodType>) => {
			const toolName = `${tool.namespace}.${tool.name}`;
			const handleTool = (async (
				args: z.output<z.ZodType>,
				_extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
			): Promise<CallToolResult> => {
				try {
					const effect = tool
						.execute(args, {
							userId: session.userId,
						})
						.pipe(withKyselyFx(kysely), withDateFx) as Effect.Effect<
						unknown,
						unknown,
						never
					>;
					const result = await Effect.runPromise(effect);

					return withSuccessResult({
						value: result,
						toolTitle: tool.title,
						schemaResourceUri: McpSchema.withSchemaResourceUri(toolName),
					});
				} catch (error) {
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
						...(() => {
							const outputSchema = McpSchema.withJsonSchema(
								tool.outputSchema,
								"output",
							);
							const itemFieldResourceUris = tool.fieldResourceUris.filter((uri) =>
								uri.startsWith(McpSchema.withFieldResourceUri("listing.")),
							);
							const itemOutputSchema =
								outputSchema.type === "array" &&
								outputSchema.items &&
								typeof outputSchema.items === "object" &&
								!Array.isArray(outputSchema.items)
									? outputSchema.items
									: undefined;

							return {
								outputSchema,
								itemOutputSchema,
								itemOutputSummary: itemOutputSchema
									? McpSchema.withSummary(itemOutputSchema)
									: undefined,
								itemFieldResourceUris: itemOutputSchema
									? itemFieldResourceUris
									: undefined,
							};
						})(),
						examples: tool.examples,
						namespace: tool.namespace,
						role: tool.role,
						workflowHint: tool.workflowHint,
						guideResourceUris: tool.guideResourceUris,
						profileResourceUris: tool.profileResourceUris,
						entityResourceUris: tool.entityResourceUris,
						fieldResourceUris: tool.fieldResourceUris,
						inputSchema: McpSchema.withJsonSchema(tool.inputSchema, "input"),
					},
				},
				handleTool,
			);
		};

		for (const tool of mcpTools) {
			registerTool(tool);
		}

		const transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			sessionIdGenerator: undefined,
		});

		await server.connect(transport);

		return transport.handleRequest(request);
	};

	const withHandler = () =>
		withMcpAuth(authApi, async (request, session) =>
			handle({
				request: withMcpCompatibleRequest(request),
				session,
			}),
		);

	root.all("/api/mcp", (c) => withHandler()(c.req.raw));
	root.all("/api/mcp/*", (c) => withHandler()(c.req.raw));
});
