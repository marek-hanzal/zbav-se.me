import type { z } from "zod";
import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import type { ServerInfo } from "~/mcp/serverInfo";

interface WithResourceMcpHealthProps {
	serverInfo: ServerInfo;
	tools: readonly McpToolDefinition.Definition<z.ZodType, z.ZodType>[];
}

export const withResourceMcpHealth = ({
	serverInfo,
	tools,
}: WithResourceMcpHealthProps): McpResourceDefinition.Definition => {
	return {
		name: "mcp-health",
		uri: "zbav://mcp/health",
		title: "MCP Health",
		description: "Runtime status for the zbav-se.me MCP server.",
		mimeType: "application/json",
		read(uri) {
			return McpResourceDefinition.withContent(uri, {
				name: serverInfo.name,
				version: serverInfo.version,
				timestamp: new Date().toISOString(),
				toolCount: tools.length,
				toolNames: tools.map((tool) => `${tool.namespace}.${tool.name}`),
			});
		},
	};
};
